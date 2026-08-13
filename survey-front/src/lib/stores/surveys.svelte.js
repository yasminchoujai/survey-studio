import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';

import {
	getSurveys,
	updateSurvey as updateSurveyApi,
	createSurvey,
	deleteSurvey as removeSurvey,
	publishSurvey as publishSurveyApi
} from '$lib/api/surveys';

import {
	getQuestions,
	createQuestion,
	updateQuestion as updateQuestionApi,
	deleteQuestion as deleteQuestionApi,
	reorderQuestions as reorderQuestionsApi
} from '$lib/api/questions';

import { getResponses as fetchResponses } from '$lib/api/responses';

export const draftStore = writable(null);

let surveys = $state([]);

function normalizeSurvey(survey) {
	if (!survey) return null;

	let sections = Array.isArray(survey.sections)
		? survey.sections
		: [];

	let questions = Array.isArray(survey.questions)
		? survey.questions
		: [];

	if (sections.length === 0 && questions.length > 0) {
		sections = [
			{
				id: 'default-section',
				title: '',
				questions
			}
		];
	}

	return {
		...survey,

		status:
			survey.status === 'published' ||
			survey.status === 'Published'
				? 'Published'
				: 'Draft',

		responses: survey.responses ?? 0,

		sections,

		questions,

		deletedQuestionIds: Array.isArray(
			survey.deletedQuestionIds
		)
			? survey.deletedQuestionIds
			: []
	};
}

function cloneSurvey(survey) {
	if (!survey) return null;

	return JSON.parse(JSON.stringify(survey));
}

function saveDraft(survey) {
	if (!survey?.id) return;

	const snapshot = cloneSurvey(survey);

	draftStore.set(snapshot);
}

function getDraft(surveyId) {
	if (!surveyId) return null;

	const draft = get(draftStore);

	if (!draft?.id) return null;

	if (draft.id !== surveyId) {
		return null;
	}

	return draft;
}

function clearDraft() {
	draftStore.set(null);
}

async function load() {
	if (!browser) return;

	const data = await getSurveys();

	surveys.splice(0, surveys.length);

	surveys.push(
		...(Array.isArray(data) ? data : []).map(
			normalizeSurvey
		)
	);

	return surveys;
}

async function addSurvey(data) {
	const survey = await createSurvey(data);

	const newSurvey = normalizeSurvey({
		...survey,
		responses: 0,
		questions: [],
		deletedQuestionIds: []
	});

	surveys.unshift(newSurvey);

	return newSurvey;
}

async function deleteSurvey(id) {
	if (!id) return;

	await removeSurvey(id);

	const index = surveys.findIndex(
		(survey) => survey.id === id
	);

	if (index !== -1) {
		surveys.splice(index, 1);
	}

	const draft = get(draftStore);

	if (draft?.id === id) {
		clearDraft();
	}
}

async function getSurvey(id) {
	if (!id) {
		throw new Error(
			'Survey ID is missing'
		);
	}

	const existingDraft = getDraft(id);

	if (existingDraft) {
		return normalizeSurvey(
			existingDraft
		);
	}

	const surveysData =
		await getSurveys();

	const survey =
		surveysData.find(
			(item) => item.id === id
		);

	if (!survey) {
		throw new Error(
			'Survey not found'
		);
	}

	let questions = [];

	try {
		questions =
			await getQuestions(id);
	} catch (error) {
		// Failed to load questions
	}

	const normalized =
		normalizeSurvey({
			...survey,

			sections: [],

			questions:
				Array.isArray(questions)
					? questions
					: [],

			deletedQuestionIds: []
		});

	saveDraft(normalized);

	return normalized;
}

function updateSurvey(
	survey,
	data = {}
) {
	if (!survey?.id) {
		throw new Error(
			'Survey is missing'
		);
	}

	const updatedSurvey = {
		...survey,

		title:
			data.title ??
			survey.title ??
			'',

		description:
			data.description ??
			survey.description ??
			''
	};

	Object.assign(
		survey,
		updatedSurvey
	);

	saveDraft(survey);

	return survey;
}

function addQuestion(
	survey,
	type
) {
	if (!survey?.id) {
		throw new Error(
			'Survey is missing'
		);
	}

	const question = {
		label: 'Untitled Question',

		type,

		required: false,

		placeholder: '',

		description: '',

		options:
			type === 'single_choice' ||
			type === 'multiple_choice'
				? [
						'Option 1',
						'Option 2'
					]
				: []
	};

	if (
		!Array.isArray(
			survey.questions
		)
	) {
		survey.questions = [];
	}

	survey.questions.push(
		question
	);

	if (
		!Array.isArray(
			survey.sections
		)
	) {
		survey.sections = [];
	}

	if (
		survey.sections.length === 0
	) {
		survey.sections.push({
			id: 'default-section',
			title: '',
			questions:
				survey.questions
		});
	} else if (
		survey.sections.length === 1 &&
		survey.sections[0].id ===
			'default-section'
	) {
		survey.sections[0].questions =
			survey.questions;
	}

	saveDraft(survey);

	return question;
}

function updateQuestion(
	survey,
	updatedQuestion
) {
	if (
		!survey?.questions ||
		!updatedQuestion
	) {
		return;
	}

	const index =
		survey.questions.findIndex(
			(question) =>
				question ===
					updatedQuestion ||
				(
					question.id &&
					updatedQuestion.id &&
					question.id ===
						updatedQuestion.id
				)
		);

	if (index === -1) {
		return;
	}

	const newQuestion = {
		...survey.questions[index],
		...updatedQuestion
	};

	survey.questions[index] =
		newQuestion;

	if (
		survey.sections?.length === 1 &&
		survey.sections[0].id ===
			'default-section'
	) {
		survey.sections[0].questions =
			survey.questions;
	}

	saveDraft(survey);

	return newQuestion;
}

function deleteQuestion(
	survey,
	question
) {
	if (
		!survey?.questions ||
		!question
	) {
		return;
	}

	const index =
		survey.questions.findIndex(
			(q) =>
				q === question ||
				(
					q.id &&
					question.id &&
					q.id === question.id
				)
		);

	if (index === -1) {
		return;
	}

	const existing =
		survey.questions[index];

	if (existing.id) {
		if (
			!Array.isArray(
				survey.deletedQuestionIds
			)
		) {
			survey.deletedQuestionIds =
				[];
		}

		if (
			!survey.deletedQuestionIds.includes(
				existing.id
			)
		) {
			survey.deletedQuestionIds.push(
				existing.id
			);
		}
	}

	survey.questions.splice(
		index,
		1
	);

	if (
		survey.sections?.length === 1 &&
		survey.sections[0].id ===
			'default-section'
	) {
		survey.sections[0].questions =
			survey.questions;
	}

	saveDraft(survey);

	return existing;
}

function duplicateQuestion(
	survey,
	question
) {
	if (
		!survey?.questions ||
		!question
	) {
		return;
	}

	const index =
		survey.questions.findIndex(
			(q) =>
				q === question ||
				(
					q.id &&
					question.id &&
					q.id === question.id
				)
		);

	if (index === -1) {
		return;
	}

	const copy = {
		label: `${
			question.label ||
			'Untitled Question'
		} Copy`,

		type: question.type,

		required:
			question.required ??
			false,

		placeholder:
			question.placeholder ??
			'',

		description:
			question.description ??
			'',

		options:
			Array.isArray(
				question.options
			)
				? [
						...question.options
					]
				: []
	};

	survey.questions.splice(
		index + 1,
		0,
		copy
	);

	if (
		survey.sections?.length === 1 &&
		survey.sections[0].id ===
			'default-section'
	) {
		survey.sections[0].questions =
			survey.questions;
	}

	saveDraft(survey);

	return copy;
}

function reorderQuestions(
	survey,
	fromIndex,
	toIndex
) {
	if (!survey?.questions) {
		return;
	}

	if (
		fromIndex === toIndex ||
		fromIndex < 0 ||
		toIndex < 0 ||
		fromIndex >=
			survey.questions.length ||
		toIndex >=
			survey.questions.length
	) {
		return;
	}

	const questions = [
		...survey.questions
	];

	const [moved] =
		questions.splice(
			fromIndex,
			1
		);

	questions.splice(
		toIndex,
		0,
		moved
	);

	survey.questions =
		questions;

	if (
		survey.sections?.length === 1 &&
		survey.sections[0].id ===
			'default-section'
	) {
		survey.sections[0].questions =
			survey.questions;
	}

	saveDraft(survey);

	return questions;
}

async function syncQuestions(
	survey
) {
	if (!survey?.id) {
		throw new Error(
			'Survey is missing'
		);
	}

	const deletedIds = [
		...(survey.deletedQuestionIds ??
			[])
	];

	for (const questionId of deletedIds) {
		await deleteQuestionApi(
			questionId
		);
	}

	for (
		let index = 0;
		index <
		survey.questions.length;
		index++
	) {
		const question =
			survey.questions[index];

		if (question.id) {
			continue;
		}

		const created =
			await createQuestion(
				survey.id,
				{
					type:
						question.type,

					label:
						question.label,

					description:
						question.description ??
						'',

					required:
						question.required ??
						false,

					placeholder:
						question.placeholder ??
						'',

					options:
						Array.isArray(
							question.options
						)
							? question.options
							: []
				}
			);

		survey.questions[index] = {
			...created,
			__localId:
				question.__localId
		};
	}

	for (const question of survey.questions) {
		if (!question.id) {
			continue;
		}

		const updated =
			await updateQuestionApi(
				question.id,
				{
					type:
						question.type,

					label:
						question.label,

					description:
						question.description ??
						'',

					required:
						question.required ??
						false,

					placeholder:
						question.placeholder ??
						'',

					options:
						Array.isArray(
							question.options
						)
							? question.options
							: []
				}
			);

		const index =
			survey.questions.findIndex(
				(q) =>
					q.id === question.id
			);

		if (index !== -1) {
			survey.questions[index] = {
				...updated,
				__localId:
					question.__localId ??
					updated.id
			};
		}
	}

	const order =
		survey.questions
			.filter(
				(question) =>
					question.id
			)
			.map(
				(question) =>
					question.id
			);

	if (order.length) {
		await reorderQuestionsApi(
			survey.id,
			order
		);
	}

	survey.deletedQuestionIds =
		[];

	return survey;
}

async function saveAllQuestions(
	survey
) {
	if (!survey?.id) {
		throw new Error(
			'Survey is missing'
		);
	}

	const updatedSurvey =
		await updateSurveyApi(
			survey.id,
			{
				title:
					survey.title ??
					'',

				description:
					survey.description ??
					''
			}
		);

	Object.assign(
		survey,
		normalizeSurvey({
			...survey,
			...updatedSurvey
		})
	);

	await syncQuestions(
		survey
	);

	saveDraft(survey);

	return survey;
}

async function publishSurvey(
	survey
) {
	if (!survey?.id) {
		throw new Error(
			'Survey is missing'
		);
	}

	await saveAllQuestions(
		survey
	);

	if (
		survey.status !==
		'Published'
	) {
		const updatedSurvey =
			await publishSurveyApi(
				survey.id
			);

		const normalized =
			normalizeSurvey({
				...survey,
				...updatedSurvey
			});

		Object.assign(
			survey,
			normalized
		);
	}

	saveDraft(survey);

	return survey;
}

async function getResponses(
	surveyId
) {
	return fetchResponses(
		surveyId
	);
}

async function getSurveyWithResponses(
	surveyId
) {
	const [
		survey,
		responses
	] = await Promise.all([
		getSurvey(surveyId),
		fetchResponses(surveyId)
	]);

	return {
		survey,
		responses
	};
}

export function useSurveys() {
	return {
		surveys,

		load,

		getSurvey,

		addSurvey,

		updateSurvey,

		deleteSurvey,

		addQuestion,

		updateQuestion,

		deleteQuestion,

		duplicateQuestion,

		reorderQuestions,

		saveAllQuestions,

		publishSurvey,

		getResponses,

		getSurveyWithResponses,

		draftStore,

		saveDraft,

		clearDraft,

		getDraft
	};
}