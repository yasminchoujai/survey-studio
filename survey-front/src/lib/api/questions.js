import { request } from './http';

export function getQuestions(surveyId, sectionId) {
	return request(
		`/surveys/${surveyId}/sections/${sectionId}/questions`
	);
}

export function createQuestion(surveyId, sectionId, question) {
	return request(
		`/surveys/${surveyId}/sections/${sectionId}/questions`,
		{
			method: 'POST',
			body: JSON.stringify(question)
		}
	);
}

export function updateQuestion(id, question) {
	return request(`/questions/${id}`, {
		method: 'PUT',
		body: JSON.stringify(question)
	});
}

export function deleteQuestion(id) {
	return request(`/questions/${id}`, {
		method: 'DELETE'
	});
}