import { request } from './http';

export function getSections(surveyId) {
	return request(
		`/surveys/${surveyId}/sections`
	);
}

export function createSection(surveyId) {
	return request(
		`/surveys/${surveyId}/sections`,
		{
			method: 'POST',
			body: JSON.stringify({
				title: 'Untitled Section'
			})
		}
	);
}

export function updateSection(id, data) {
	return request(`/sections/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export function deleteSection(id) {
	return request(`/sections/${id}`, {
		method: 'DELETE'
	});
}