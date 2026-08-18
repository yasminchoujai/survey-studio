import { request } from './http.js';

import {
	responsesSchema,
	submitResponseSchema
} from '$lib/schemas/response.js';

import { validate } from '$lib/utils/validate.js';

export async function getResponses(surveyId) {
	const data = await request(
		`/responses/survey/${surveyId}`
	);

	return validate(responsesSchema, data);
}

export async function submitResponse(surveyId, answers) {
	const data = await request('/responses', {
		method: 'POST',
		body: JSON.stringify({
			surveyId,
			answers
		})
	});

	return validate(submitResponseSchema, data);
}