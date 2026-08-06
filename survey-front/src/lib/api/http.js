// Define the base URL for all API requests
// This is the backend endpoint where all requests will be sent
const API_URL = 'http://localhost:3000/api';

// Export the main request function that handles all API calls
// Parameters:
//   - url: the endpoint path (e.g., '/surveys')
//   - options: optional fetch configuration (method, body, headers, etc.)
export async function request(
	url,
	options = {}
) {
	// 1. Make the actual fetch request to the backend
	//    Combines the base URL with the provided endpoint path
	const response = await fetch(
		`${API_URL}${url}`,  // Example: 'http://localhost:3000/api' + '/surveys'
		{
			// Default headers that will be sent with every request
			headers: {
				// Tell the server we're sending JSON data
				'Content-Type': 'application/json',
				
				// Spread any additional headers passed in options
				// If options.headers exists, merge them; otherwise use empty object
				...(options.headers ?? {})
			},
			
			// Spread all other options (method, body, credentials, etc.)
			// This allows the caller to override defaults
			...options
		}
	);

	// 2. Parse the response body as JSON
	//    This converts the JSON string from the server into a JavaScript object
	const result = await response.json();

	// 3. Check if the response was not successful (status code 4xx or 5xx)
	if (!response.ok) {
		// Throw an error with the server's error message or a generic one
		throw new Error(
			result.message || 'Something went wrong'
		);
	}

	// 4. If successful, return the data from the response
	//    Assumes the API returns a consistent format: { data: ..., message: ... }
	return result.data;
}