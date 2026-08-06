let toasts = $state([]);
let nextId = 1;

function push(message, type = 'info') {
	const id = nextId++;

	toasts.push({ id, message, type });

	setTimeout(() => remove(id), 3000);
}

function remove(id) {
	const index = toasts.findIndex((toast) => toast.id === id);

	if (index !== -1) {
		toasts.splice(index, 1);
	}
}

export function useToast() {
	return {
		toasts,
		success: (message) => push(message, 'success'),
		error: (message) => push(message, 'error'),
		info: (message) => push(message, 'info'),
		remove
	};
}