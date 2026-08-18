import { request } from './http.js';

import {
	loginResponseSchema,
	userSchema
} from '$lib/schemas/auth.js';

import { validate } from '$lib/utils/validate.js';

export async function login(email, password) {
	const data = await request('/auth/login', {
		method: 'POST',
		body: JSON.stringify({
			email,
			password
		})
	});

	return validate(loginResponseSchema, data);
}

export async function getMe(token) {
	if (!token) {
		throw new Error('No authentication token available');
	}

	const data = await request('/auth/me', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	return validate(userSchema, data);
}