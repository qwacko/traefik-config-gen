import { z } from 'zod';

export const createTemplateSchema = z.object({
	title: z.string().min(1),
	template: z.string().optional().default('')
});

export type createTemplateSchemaType = typeof createTemplateSchema;

export const updateTempateSchema = z.object({
	id: z.string().cuid(),
	title: z.string().optional(),
	template: z.string().optional(),
	exampleData: z.string().optional().nullable()
});

export type updateTemplateSchemaType = typeof updateTempateSchema;
