import { request } from './http';

export function getAllSurveysStatistics() {
	return request('/statistics');
}

export function getSurveyStatistics(surveyId) {
	return request(`/surveys/${surveyId}/statistics`);
}