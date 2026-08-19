const API_URL = 'http://localhost:3000/api';

export async function request(url, options = {}) {
	const token =
		typeof window !== 'undefined'
			? localStorage.getItem('authToken')
			: null;

	// Don't send this custom option to fetch()
	const { returnFullResponse = false, ...fetchOptions } =
		options;

	const headers = {
		'Content-Type': 'application/json',
		...(fetchOptions.headers ?? {})
	};

	if (token && !headers.Authorization) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${url}`, {
		...fetchOptions,
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

	// Some endpoints return data,
	// while others return success/message directly.
	if (returnFullResponse) {
		return result;
	}

	return result?.data;
}