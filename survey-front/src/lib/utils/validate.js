import { ZodError } from 'zod';

export function validate(schema, data) {
	try {
		return schema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			console.error('Zod validation failed:', error.issues);
		}

		throw error;
	}
}