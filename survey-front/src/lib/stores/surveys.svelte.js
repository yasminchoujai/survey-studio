import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

import {
	getSurveys,
	getSurvey as fetchSurvey,
	createSurvey,
	deleteSurvey as removeSurvey,
	publishSurvey as publishSurveyApi
} from '$lib/api/surveys';

import {
	getSections,
	createSection,
	updateSection as updateSectionApi,
	deleteSection as deleteSectionApi
} from '$lib/api/sections';

import {
	getQuestions,
	createQuestion,
	updateQuestion as updateQuestionApi,
	deleteQuestion as deleteQuestionApi,
	reorderQuestions as reorderQuestionsApi
} from '$lib/api/questions';

import { getResponses as fetchResponses } from '$lib/api/responses';

export const draftStore = writable(null);

const state = $state({
	surveys: [],
	loading: true,
	error: null
});

function save() {}

async function load() {
	if (!browser) return;

	state.loading = true;
	state.error = null;

	try {
		const data = await getSurveys();

		state.surveys.splice(0, state.surveys.length);

		state.surveys.push(
			...data.map((survey) => ({
				...survey,
				status: survey.status === 'published' ? 'Published' : 'Draft',
				responses: survey.responses ?? 0,
				sections: [],
				updatedAt: survey.updatedAt
			}))
		);
	} catch (err) {
		console.error('Failed to load surveys:', err);
		state.error = err?.message ?? 'Failed to load surveys.';
	} finally {
		state.loading = false;
	}
}

async function addSurvey(data) {
	const survey = await createSurvey(data);

	state.surveys.unshift({
		...survey,
		status: survey.status === 'published' ? 'Published' : 'Draft',
		responses: 0,
		sections: [],
		updatedAt: survey.updatedAt
	});
}

async function deleteSurvey(id) {
	await removeSurvey(id);

	const index = state.surveys.findIndex((survey) => survey.id === id);

	if (index !== -1) {
		state.surveys.splice(index, 1);
	}
}

async function getSurvey(id) {
	const survey = await fetchSurvey(id);

	const sections = await getSections(id);

	for (const section of sections) {
		section.questions = await getQuestions(id, section.id);
	}

	return {
		...survey,
		status: survey.status === 'published' ? 'Published' : 'Draft',
		responses: survey.responses ?? 0,
		sections,
		updatedAt: survey.updatedAt
	};
}

async function addSection(survey) {
	const section = await createSection(survey.id);

	survey.sections.push({
		...section,
		questions: []
	});

	return section;
}

async function updateSection(survey, updatedSection) {
	const savedSection = await updateSectionApi(
		updatedSection.id,
		updatedSection
	);

	const existing = survey.sections.find(
		(section) => section.id === savedSection.id
	);

	if (existing) {
		Object.assign(existing, savedSection);
	}

	return savedSection;
}

async function deleteSection(survey, sectionId) {
	await deleteSectionApi(sectionId);

	const index = survey.sections.findIndex(
		(section) => section.id === sectionId
	);

	if (index !== -1) {
		survey.sections.splice(index, 1);
	}
}

async function addQuestion(survey, sectionId, question) {
	const createdQuestion = await createQuestion(
		survey.id,
		sectionId,
		question
	);

	const section = survey.sections.find((s) => s.id === sectionId);

	if (!section) return;

	if (!section.questions) {
		section.questions = [];
	}

	section.questions.push(createdQuestion);

	return createdQuestion;
}

async function updateQuestion(survey, updatedQuestion) {
	const savedQuestion = await updateQuestionApi(
		updatedQuestion.id,
		updatedQuestion
	);

	for (const section of survey.sections) {
		const existing = section.questions.find(
			(q) => q.id === savedQuestion.id
		);

		if (!existing) continue;

		Object.assign(existing, savedQuestion);

		return savedQuestion;
	}

	return savedQuestion;
}

async function deleteQuestion(survey, questionId) {
	await deleteQuestionApi(questionId);

	for (const section of survey.sections) {
		const index = section.questions.findIndex(
			(question) => question.id === questionId
		);

		if (index !== -1) {
			section.questions.splice(index, 1);
			return;
		}
	}
}

async function duplicateQuestion(survey, questionId) {
	for (const section of survey.sections) {
		const question = section.questions.find(
			(q) => q.id === questionId
		);

		if (!question) continue;

		const copy = {
			label: `${question.label} Copy`,
			type: question.type,
			description: question.description,
			required: question.required,
			placeholder: question.placeholder,
			options: [...(question.options ?? [])]
		};

		return await addQuestion(
			survey,
			section.id,
			copy
		);
	}
}

async function reorderSectionQuestions(survey, section) {
	if (!survey || !section) return;
	if (!section.questions?.length) return;

	const order = section.questions.map(
		(question) => question.id
	);

	await reorderQuestionsApi(
		survey.id,
		section.id,
		order
	);
}

async function publishSurvey(survey) {
	const updatedSurvey = await publishSurveyApi(survey.id);

	const status =
		updatedSurvey.status === 'published'
			? 'Published'
			: 'Draft';

	survey.status = status;
	survey.updatedAt = updatedSurvey.updatedAt;

	const existing = state.surveys.find(
		(s) => s.id === survey.id
	);

	if (existing) {
		existing.status = status;
		existing.updatedAt = updatedSurvey.updatedAt;
	}

	return updatedSurvey;
}

async function saveAllQuestions(survey) {
	for (const section of survey.sections) {
		for (const question of section.questions) {
			await updateQuestion(survey, question);
		}
	}
}

<<<<<<< Updated upstream
/* ===========================
	Responses
=========================== */
=======
async function saveAllSections(survey) {
	for (const section of survey.sections) {
		await updateSection(survey, section);
	}
}
>>>>>>> Stashed changes

async function getResponses(surveyId) {
	return await fetchResponses(surveyId);
}

async function getSurveyWithResponses(surveyId) {
	const [survey, responses] = await Promise.all([
		getSurvey(surveyId),
		fetchResponses(surveyId)
	]);

	return {
		survey,
		responses
	};
}

function saveDraft(survey) {
	if (survey) {
		draftStore.set(
			JSON.parse(JSON.stringify(survey))
		);
	}
}

function clearDraft() {
	draftStore.set(null);
}

export function useSurveys() {
	return {
		get surveys() { return state.surveys },
		get loading() { return state.loading },
		get error() { return state.error },
		load,
		save,
		getSurvey,
		addSurvey,
		deleteSurvey,
		addSection,
		updateSection,
		deleteSection,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion,
		reorderSectionQuestions,
		publishSurvey,
		getResponses,
		getSurveyWithResponses,
		saveAllQuestions,
<<<<<<< Updated upstream
=======
		saveAllSections,
>>>>>>> Stashed changes
		draftStore,
		saveDraft,
		clearDraft
	};
}