import { z } from 'zod';

export const surveyStatisticsSchema = z.object({
	surveyId: z.string().uuid(),

	title: z.string(),

	status: z.enum(['draft', 'published']),

	totalResponses: z.number(),

	totalQuestions: z.number(),

	averageCompletionRate: z.number()
});

export const statisticsSchema = z.object({
	totalSurveys: z.number(),

	totalResponses: z.number(),

	totalQuestions: z.number(),

	surveys: z.array(surveyStatisticsSchema)
});