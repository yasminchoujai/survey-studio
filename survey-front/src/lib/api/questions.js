import { request } from './http.js';

export async function getQuestions(surveyId) {
	return request(`/surveys/${surveyId}/questions`);
}

export async function createQuestion(surveyId, question) {
	return request(`/surveys/${surveyId}/questions`, {
		method: 'POST',
		body: JSON.stringify(question)
	});
}

export async function updateQuestion(questionId, question) {
	return request(`/questions/${questionId}`, {
		method: 'PUT',
		body: JSON.stringify(question)
	});
}

export async function deleteQuestion(questionId) {
	return request(`/questions/${questionId}`, {
		method: 'DELETE'
	});
}

export async function reorderQuestions(surveyId, order) {
	return request(`/surveys/${surveyId}/questions/reorder`, {
		method: 'PATCH',
		body: JSON.stringify({ order })
	});
}