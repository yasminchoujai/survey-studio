import { request } from './http.js';

import { publicSurveySchema } from '$lib/schemas/publicSurvey.js';

import { validate } from '$lib/utils/validate.js';

export async function getPublicSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	const data = await request(`/public/surveys/${id}`);

	return validate(publicSurveySchema, data);
}