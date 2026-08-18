import { z } from 'zod';
import { questionSchema } from './question.js';

export const publicSurveySchema = z.object({
	id: z.string().uuid(),

	title: z.string(),

	description: z.string().nullable().optional(),

	status: z.enum(['draft', 'published', 'Draft', 'Published']),

	createdAt: z.string(),

	updatedAt: z.string(),

	publishedAt: z.string().nullable().optional(),

	questions: z.array(questionSchema)
});