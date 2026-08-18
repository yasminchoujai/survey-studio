import { z } from 'zod';

export const loginResponseSchema = z.object({
	token: z.string().min(1)
});

export const userSchema = z.object({
	sub: z.string(),
	email: z.string().email(),
	role: z.string(),
	iat: z.number(),
	exp: z.number()
});