import { browser } from '$app/environment';

import {
	login as loginApi,
	getMe
} from '$lib/api/auth.js';

let token = $state(null);
let user = $state(null);
let loading = $state(false);
let initialized = $state(false);
let error = $state(null);

function saveToken(newToken) {
	if (!browser || !newToken) return;

	token = newToken;
	localStorage.setItem('authToken', newToken);
}

function removeToken() {
	token = null;
	user = null;

	if (browser) {
		localStorage.removeItem('authToken');
	}
}

async function login(email, password) {
	loading = true;
	error = null;

	try {
		// Send credentials to the backend.
		const response = await loginApi(
			email,
			password
		);

		const newToken = response?.token;

		if (!newToken) {
			error = 'Invalid email or password';
			return false;
		}

		// Save the JWT returned by the backend.
		saveToken(newToken);

		// Get the authenticated user from the backend.
		const currentUser = await getMe(newToken);

		user = currentUser;

		return true;
	} catch (err) {
		removeToken();

		// Keep the error inside the UI.
		error =
			err instanceof Error && err.message
				? err.message
				: 'Invalid email or password';

		return false;
	} finally {
		loading = false;
	}
}

async function initialize() {
	if (!browser || initialized) return;

	loading = true;
	error = null;

	try {
		const savedToken =
			localStorage.getItem('authToken');

		// No saved token = not logged in.
		if (!savedToken) {
			return;
		}

		token = savedToken;

		// Verify the saved token with the backend.
		const currentUser =
			await getMe(savedToken);

		user = currentUser;
	} catch {
		// Token is expired/invalid.
		removeToken();
		error = null;
	} finally {
		loading = false;
		initialized = true;
	}
}

function logout() {
	removeToken();
	error = null;
}

function isAuthenticated() {
	return Boolean(token && user);
}

export function useAuth() {
	return {
		get token() {
			return token;
		},

		get user() {
			return user;
		},

		get loading() {
			return loading;
		},

		get initialized() {
			return initialized;
		},

		get error() {
			return error;
		},

		login,
		logout,
		initialize,
		isAuthenticated
	};
}