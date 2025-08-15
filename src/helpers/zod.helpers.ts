import type { ZodError } from 'zod';

export const formatZodErrors = (schema: ZodError, fieldAddon: string = '') => ({
	errors: schema.errors.map((err) => ({
		field: err.path.join('') + fieldAddon,
		message: err.message
	}))
});
