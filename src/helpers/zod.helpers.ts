import type { ZodError } from 'zod';

export const formatZodErrors = (schema: ZodError) => ({
	errors: schema.errors.map((err) => ({
		field: err.path.join(''),
		message: err.message
	}))
});
