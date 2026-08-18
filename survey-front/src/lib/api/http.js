const API_URL = 'http://localhost:3000/api';

export async function request(url, options = {}) {
	const token =
		typeof window !== 'undefined'
			? localStorage.getItem('authToken')
			: null;

	const headers = {
		'Content-Type': 'application/json',
		...(options.headers ?? {})
	};

	if (token && !headers.Authorization) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${url}`, {
		...options,
		headers
	});

	let result = null;

	try {
		result = await response.json();
	} catch {
		result = null;
	}

	if (!response.ok) {
		const error = new Error(
			result?.message || 'Something went wrong'
		);

		error.status = response.status;

		throw error;
	}

	return result?.data;
}