import { browser } from '$app/environment';

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
	deleteQuestion as deleteQuestionApi
} from '$lib/api/questions';

import { getResponses as fetchResponses } from '$lib/api/responses';

let surveys = $state([]);

function save() {}

async function load() {
	if (!browser) return;

	const data = await getSurveys();

	surveys.splice(0, surveys.length);

	for (const survey of data) {
		surveys.push({
			...survey,
			status:
				survey.status === 'published'
					? 'Published'
					: 'Draft',
			responses: survey.responses || 0,
			sections: [],
			updatedAt: survey.updatedAt
		});
	}
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

	if (index > -1) {
		surveys.splice(index, 1);
	}
}

async function getSurvey(id) {
	const survey = await fetchSurvey(id);

	const sections = await getSections(id);

	for (const section of sections) {
		const questions = await getQuestions(
			id,
			section.id
		);

		section.questions = questions;
	}

	return {
		...survey,
		status:
			survey.status === 'published'
				? 'Published'
				: 'Draft',
		responses: survey.responses || 0,
		sections,
		updatedAt: survey.updatedAt
	};
}

/* ===========================
   Builder
=========================== */

async function addSection(survey) {
	const section = await createSection(
		survey.id
	);

	survey.sections.push({
		...section,
		questions: []
	});

	return section;
}

async function updateSection(
	survey,
	updatedSection
) {
	const savedSection =
		await updateSectionApi(
			updatedSection.id,
			updatedSection
		);

	const section = survey.sections.find(
		(section) =>
			section.id === savedSection.id
	);

	if (section) {
		Object.assign(
			section,
			savedSection
		);
	}

	return savedSection;
}

async function deleteSection(
	survey,
	sectionId
) {
	await deleteSectionApi(sectionId);

	const index = survey.sections.findIndex(
		(section) =>
			section.id === sectionId
	);

	if (index > -1) {
		survey.sections.splice(index, 1);
	}
}async function addQuestion(
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
		(section) =>
			section.id === sectionId
	);

	if (!section) {
		return;
	}

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
		const question =
			section.questions.find(
				(question) =>
					question.id === savedQuestion.id
			);

		if (question) {
			Object.assign(
				question,
				savedQuestion
			);

			return savedQuestion;
		}
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

		if (index > -1) {
			section.questions.splice(
				index,
				1
			);

			return;
		}
	}
}

function duplicateQuestion(
	survey,
	questionId
) {
	for (const section of survey.sections) {
		const question =
			section.questions.find(
				(question) =>
					question.id === questionId
			);

		if (question) {
			const copy = {
				label: `${question.label} Copy`,
				type: question.type,
				description:
					question.description,
				required:
					question.required,
				placeholder:
					question.placeholder,
				options: [
					...(question.options || [])
				]
			};

			return addQuestion(
				survey,
				section.id,
				copy
			);
		}
	}
}
/* ===========================
   Publish
=========================== */

async function publishSurvey(survey) {
	const updatedSurvey =
		await publishSurveyApi(survey.id);

	survey.status =
		updatedSurvey.status === 'published'
			? 'Published'
			: 'Draft';

	survey.updatedAt =
		updatedSurvey.updatedAt;

	const surveyItem = surveys.find(
		(item) => item.id === survey.id
	);

	if (surveyItem) {
		surveyItem.status = survey.status;
		surveyItem.updatedAt =
			survey.updatedAt;
	}

	return updatedSurvey;
}

/* ===========================
   Responses
=========================== */

function getResponses(surveyId) {
	return fetchResponses(surveyId);
}

async function getSurveyWithResponses(
	surveyId
) {
	const survey = await getSurvey(
		surveyId
	);

	const responses =
		await fetchResponses(surveyId);

	return {
		survey,
		responses
	};
}

/* ===========================
   Store
=========================== */

export function useSurveys() {
	return {
		surveys,
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
		publishSurvey,
		getResponses,
		getSurveyWithResponses
	};
}