const API_URL = 'http://localhost:3000/api';

export async function request(
	url,
	options = {}
) {
	const response = await fetch(
		`${API_URL}${url}`,
		{
			headers: {
				'Content-Type': 'application/json',
				...(options.headers ?? {})
			},
			...options
		}
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(
			result.message || 'Something went wrong'
		);
	}

	return result.data;
}