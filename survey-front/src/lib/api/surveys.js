const API_URL = 'http://localhost:3000/api';

async function request(url, options = {}) {
	const response = await fetch(`${API_URL}${url}`, {
		headers: {
			'Content-Type': 'application/json'
		},
		...options
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || 'Something went wrong');
	}

	return result.data;
}

// =====================
// Surveys
// =====================

export async function getSurveys() {
	return request('/surveys');
}

export async function getSurvey(id) {
	return request(`/surveys/${id}`);
}

export async function createSurvey(data) {
	return request('/surveys', {
		method: 'POST',
		body: JSON.stringify(data)
	});
}

export async function updateSurvey(id, data) {
	return request(`/surveys/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data)
	});
}

export async function deleteSurvey(id) {
	return request(`/surveys/${id}`, {
		method: 'DELETE'
	});
}

export async function publishSurvey(id) {
	return request(`/surveys/${id}/publish`, {
		method: 'PATCH'
	});
}