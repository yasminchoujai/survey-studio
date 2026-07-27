const API_URL = 'http://localhost:3000/api';

export async function getQuestions(surveyId, sectionId) {
	const response = await fetch(
		`${API_URL}/surveys/${surveyId}/sections/${sectionId}/questions`
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return result.data;
}

export async function createQuestion(
	surveyId,
	sectionId,
	question
) {
	const response = await fetch(
		`${API_URL}/surveys/${surveyId}/sections/${sectionId}/questions`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(question)
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return result.data;
}

export async function updateQuestion(id, question) {
	const response = await fetch(
		`${API_URL}/questions/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(question)
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message);
	}

	return result.data;
}

export async function deleteQuestion(id) {
	const response = await fetch(
		`${API_URL}/questions/${id}`,
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