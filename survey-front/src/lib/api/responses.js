const API_URL = 'http://localhost:3000/api';


export async function getResponses(surveyId) {
	const response = await fetch(
		`${API_URL}/responses/survey/${surveyId}`
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || 'Failed to load responses');
	}

	return result.data;
}


export async function submitResponse(surveyId, answers) {
	const response = await fetch(
		`${API_URL}/responses`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ 
                surveyId,
                answers 
            })
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || 'Failed to submit response');
	}

	return result.data;
}