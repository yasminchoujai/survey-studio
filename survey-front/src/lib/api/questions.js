import { request } from './http.js';

import {
	questionsSchema,
	questionSchema
} from '$lib/schemas/question.js';

import { validate } from '$lib/utils/validate.js';

export async function getQuestions(surveyId) {
	const data = await request(`/surveys/${surveyId}/questions`);

	return validate(questionsSchema, data);
}

export async function createQuestion(surveyId, question) {
	const data = await request(`/surveys/${surveyId}/questions`, {
		method: 'POST',
		body: JSON.stringify(question)
	});

	return validate(questionSchema, data);
}

export async function updateQuestion(questionId, question) {
	const data = await request(`/questions/${questionId}`, {
		method: 'PUT',
		body: JSON.stringify(question)
	});

	return validate(questionSchema, data);
}

export async function deleteQuestion(questionId) {
	const data = await request(`/questions/${questionId}`, {
		method: 'DELETE'
	});

	return data;
}

export async function reorderQuestions(surveyId, order) {
	const data = await request(
		`/surveys/${surveyId}/questions/reorder`,
		{
			method: 'PATCH',
			body: JSON.stringify({ order })
		}
	);

	return data;
}