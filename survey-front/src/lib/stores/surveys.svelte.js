import { browser } from '$app/environment';

import {
	getSurveys,
	getSurvey as fetchSurvey,
	createSurvey,
	deleteSurvey as removeSurvey
} from '$lib/api/surveys';

import {
	getSections,
	createSection,
	deleteSection as deleteSectionApi
} from '$lib/api/sections';

import {
	getQuestions,
	createQuestion,
	updateQuestion as updateQuestionApi,
	deleteQuestion as deleteQuestionApi
} from '$lib/api/questions';

let surveys = $state([]);

function save() {}

async function load() {
	if (!browser) return;

	const data = await getSurveys();

	surveys.splice(0, surveys.length);

	surveys.push(
		...data.map((survey) => ({
			...survey,
			status:
				survey.status === 'published'
					? 'Published'
					: 'Draft',
			responses: survey.responses ?? 0,
			sections: [],
			updatedAt: survey.updatedAt
		}))
	);
}

async function addSurvey(data) {
	const survey = await createSurvey(data);

	surveys.unshift({
		...survey,
		status:
			survey.status === 'published'
				? 'Published'
				: 'Draft',
		responses: 0,
		sections: [],
		updatedAt: survey.updatedAt
	});
}

async function deleteSurvey(id) {
	await removeSurvey(id);

	const index = surveys.findIndex(
		(survey) => survey.id === id
	);

	if (index !== -1) {
		surveys.splice(index, 1);
	}
}

async function getSurvey(id) {
	const survey = await fetchSurvey(id);

	const sections = await getSections(id);

	for (const section of sections) {
		section.questions = await getQuestions(
			id,
			section.id
		);
	}

	return {
		...survey,
		status:
			survey.status === 'published'
				? 'Published'
				: 'Draft',
		responses: survey.responses ?? 0,
		sections,
		updatedAt: survey.updatedAt
	};
}

/* ===========================
   Builder
=========================== */

async function addSection(survey) {
	const section = await createSection(survey.id);

	survey.sections.push({
		...section,
		questions: []
	});

	return section;
}

async function deleteSection(
	survey,
	sectionId
) {
	await deleteSectionApi(sectionId);

	const index = survey.sections.findIndex(
		(section) => section.id === sectionId
	);

	if (index !== -1) {
		survey.sections.splice(index, 1);
	}
}

async function addQuestion(
	survey,
	sectionId,
	question
) {
	const createdQuestion =
		await createQuestion(
			survey.id,
			sectionId,
			question
		);

	const section = survey.sections.find(
		(s) => s.id === sectionId
	);

	if (!section) return;

	if (!section.questions) {
		section.questions = [];
	}

	section.questions.push(createdQuestion);

	return createdQuestion;
}

async function updateQuestion(
	survey,
	updatedQuestion
) {
	const savedQuestion =
		await updateQuestionApi(
			updatedQuestion.id,
			updatedQuestion
		);

	for (const section of survey.sections) {
		const existing =
			section.questions.find(
				(q) => q.id === savedQuestion.id
			);

		if (!existing) continue;

		Object.assign(
			existing,
			savedQuestion
		);

		return savedQuestion;
	}

	return savedQuestion;
}

async function deleteQuestion(
	survey,
	questionId
) {
	await deleteQuestionApi(questionId);

	for (const section of survey.sections) {
		const index =
			section.questions.findIndex(
				(question) =>
					question.id === questionId
			);

		if (index !== -1) {
			section.questions.splice(
				index,
				1
			);

			return;
		}
	}
}

async function duplicateQuestion(
	survey,
	questionId
) {
	for (const section of survey.sections) {
		const question =
			section.questions.find(
				(q) => q.id === questionId
			);

		if (!question) continue;

		const copy = {
			label: `${question.label} Copy`,
			type: question.type,
			description:
				question.description,
			required: question.required,
			placeholder:
				question.placeholder,
			options: [
				...(question.options ?? [])
			]
		};

		return await addQuestion(
			survey,
			section.id,
			copy
		);
	}
}

export function useSurveys() {
	return {
		surveys,
		load,
		save,
		getSurvey,
		addSurvey,
		deleteSurvey,
		addSection,
		deleteSection,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion
	};
}