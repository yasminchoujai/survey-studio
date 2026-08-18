import { z } from 'zod';

export const questionSchema = z.object({
	id: z.string().uuid().optional(),

	label: z.string(),

	description: z.string().nullable().optional(),

	type: z.enum([
		'short_text',
		'long_text',
		'email',
		'single_choice',
		'multiple_choice',
		'rating'
	]),

	required: z.boolean().default(false),

	placeholder: z.string().nullable().optional(),

	options: z.array(z.string()).default([])
});

export const questionsSchema = z.array(questionSchema);