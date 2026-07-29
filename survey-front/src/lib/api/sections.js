const API_URL = 'http://localhost:3000/api';

export async function getSections(surveyId) {
	const response = await fetch(
		`${API_URL}/surveys/${surveyId}/sections`
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || 'Failed to load sections');
	}

	return result.data;
}

export async function createSection(surveyId) {
	const response = await fetch(
		`${API_URL}/surveys/${surveyId}/sections`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: 'Untitled Section'
			})
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return result.data;
}

export async function updateSection(id, data) {
	const response = await fetch(
		`${API_URL}/sections/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return result.data;
}

export async function deleteSection(id) {
	const response = await fetch(
		`${API_URL}/sections/${id}`,
		{
			method: 'DELETE'
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return true;
}