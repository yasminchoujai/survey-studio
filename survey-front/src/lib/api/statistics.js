import { request } from './http.js';

import { statisticsSchema } from '$lib/schemas/statistics.js';

import { validate } from '$lib/utils/validate.js';

export async function getAllSurveysStatistics() {
	const data = await request('/statistics');

	return validate(statisticsSchema, data);
}