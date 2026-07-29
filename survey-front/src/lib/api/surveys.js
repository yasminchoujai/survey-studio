import { request } from './http';

export function getSurveys() {
	return request('/surveys');
}

export function getSurvey(id) {
	return request(`/surveys/${id}`);
}

export function createSurvey(data) {
	return request('/surveys', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export function updateSurvey(id, data) {
	return request(`/surveys/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export function deleteSurvey(id) {
	return request(`/surveys/${id}`, {
		method: 'DELETE'
	});
}

export function publishSurvey(id) {
	return request(`/surveys/${id}/publish`, {
		method: 'PATCH'
	});
}