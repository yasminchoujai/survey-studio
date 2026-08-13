import { request } from './http.js';



export async function getSurveys() {
	return request('/surveys');
}



export async function getSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	return request(`/surveys/${id}`);
}


export async function createSurvey(data) {
	return request('/surveys', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}



export async function updateSurvey(id, data) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	console.log('💾 PUT /api/surveys/:id', id, data);

	return request(`/surveys/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
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

	return request(`/surveys/${id}/publish`, {
		method: 'PATCH'
	});
}


export async function unpublishSurvey(id) {
	if (!id) {
		throw new Error('Survey ID is missing');
	}

	return request(`/surveys/${id}/unpublish`, {
		method: 'PATCH'
	});
}