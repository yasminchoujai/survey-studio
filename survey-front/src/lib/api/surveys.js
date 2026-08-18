import { request } from './http.js';

import {
	surveySchema,
	surveysSchema
} from '$lib/schemas/survey.js';

import { validate } from '$lib/utils/validate.js';

export async function getSurveys() {
	const data = await request('/surveys');

	return validate(surveysSchema, data);
}

export async function getSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	const data = await request(`/surveys/${id}`);

	return validate(surveySchema, data);
}

export async function createSurvey(data) {
	const result = await request('/surveys', {
		method: 'POST',
		body: JSON.stringify(data)
	});

	return validate(surveySchema, result);
}

export async function updateSurvey(id, data) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	const result = await request(`/surveys/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});

	return validate(surveySchema, result);
}

export async function deleteSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	return request(`/surveys/${id}`, {
		method: 'DELETE'
	});
}

export async function publishSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	const result = await request(`/surveys/${id}/publish`, {
		method: 'PATCH'
	});

	return validate(surveySchema, result);
}

export async function unpublishSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	const result = await request(`/surveys/${id}/unpublish`, {
		method: 'PATCH'
	});

	return validate(surveySchema, result);
}