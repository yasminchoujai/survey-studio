import { request } from './http';

export function getResponses(surveyId) {
	return request(
		`/responses/survey/${surveyId}`
	);
}

export function submitResponse(
	surveyId,
	answers
) {
	return request('/responses', {
		method: 'POST',
		body: JSON.stringify({
			surveyId,
			answers
		})
	});
}