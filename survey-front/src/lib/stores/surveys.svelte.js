import { browser } from '$app/environment';

const STORAGE_KEY = 'surveys';

const defaultSurveys = [
	{
		id: 1,
		title: 'Employee Feedback',
		description: 'Internal employee satisfaction survey.',
		status: 'Draft',
		responses: 0,
		updatedAt: 'Jul 21, 2026',
		sections: [
			{
				id: 1,
				title: 'Untitled Section',
				orderIndex: 0,
				questions: []
			}
		]
	}
];

let surveys = $state([]);

function save() {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
}

function load() {
	if (!browser) return;

	surveys.splice(0, surveys.length);

	const stored = localStorage.getItem(STORAGE_KEY);

	if (stored) {
		surveys.push(...JSON.parse(stored));
	} else {
		surveys.push(...defaultSurveys);
		save();
	}
}

function getSurvey(id) {
	return surveys.find((survey) => survey.id === Number(id));
}

function updateSurvey(updatedSurvey) {
	const survey = getSurvey(updatedSurvey.id);

	if (!survey) return;

	Object.assign(survey, updatedSurvey);

	save();
}

function addSection(surveyId) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	survey.sections.push({
		id: Date.now(),
		title: 'Untitled Section',
		orderIndex: survey.sections.length,
		questions: []
	});

	save();
}

function deleteSection(surveyId, sectionId) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	const index = survey.sections.findIndex(
		(section) => section.id === sectionId
	);

	if (index !== -1) {
		survey.sections.splice(index, 1);
		save();
	}
}

function addQuestion(surveyId, sectionId, question) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	const section = survey.sections.find(
		(section) => section.id === sectionId
	);

	if (!section) return;

	section.questions.push(question);

	save();
}

function updateQuestion(surveyId, updatedQuestion) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	for (const section of survey.sections) {
		const question = section.questions.find(
			(q) => q.id === updatedQuestion.id
		);

		if (!question) continue;

		Object.assign(question, updatedQuestion);

		save();

		return;
	}
}

function deleteQuestion(surveyId, questionId) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	for (const section of survey.sections) {
		const index = section.questions.findIndex(
			(question) => question.id === questionId
		);

		if (index !== -1) {
			section.questions.splice(index, 1);

			save();

			return;
		}
	}
}

function duplicateQuestion(surveyId, questionOrId) {
	const survey = getSurvey(surveyId);

	if (!survey) return;

	const questionId =
		typeof questionOrId === 'object'
			? questionOrId.id
			: questionOrId;

	for (const section of survey.sections) {
		const index = section.questions.findIndex(
			(q) => q.id == questionId
		);

		if (index === -1) continue;

		const question = section.questions[index];

		const duplicate = {
			...question,
			id: Date.now() + Math.random(),
			label: `${question.label} Copy`,
			options: question.options
				? [...question.options]
				: []
		};

		section.questions.splice(index + 1, 0, duplicate);

		save();

		return duplicate;
	}
}
export function useSurveys() {
	return {
		surveys,
		load,
		save,
		getSurvey,
		updateSurvey,
		addSection,
		deleteSection,
		addQuestion,
		updateQuestion,
		deleteQuestion,
		duplicateQuestion
	};
}