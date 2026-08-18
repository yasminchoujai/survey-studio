import { z } from 'zod';

export const responseSchema = z.object({
	id: z.string().uuid().optional(),

	surveyId: z.string().uuid(),

	answers: z.any(),

	createdAt: z.string().optional(),

	updatedAt: z.string().optional()
});

export const responsesSchema = z.array(responseSchema);

export const submitResponseSchema = z.object({
	success: z.boolean(),
	message: z.string()
});

export function getAnswer(response, questionId) {
	if (!response) return undefined;

	if (Array.isArray(response.answers)) {
		return response.answers.find(
			(answer) => answer.questionId === questionId
		)?.value;
	}

	if (
		response.answers &&
		typeof response.answers === 'object'
	) {
		return response.answers[questionId];
	}

	return undefined;
}

export function isAnswered(value) {
	if (value === undefined || value === null) {
		return false;
	}

	if (Array.isArray(value)) {
		return value.length > 0;
	}

	if (typeof value === 'string') {
		return value.trim().length > 0;
	}

	return true;
}

export function formatAnswer(question, value) {
	if (!isAnswered(value)) {
		return null;
	}

	if (
		question.type === 'multiple_choice' &&
		Array.isArray(value)
	) {
		return value;
	}

	if (question.type === 'rating') {
		return `${value} / 5`;
	}

	return String(value);
}   