import { request } from './http';

export function getPublicSurvey(id) {
	return request(`/public/surveys/${id}`);
}