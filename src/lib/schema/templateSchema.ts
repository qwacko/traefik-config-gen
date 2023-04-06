import { z } from 'zod';

export const createTemplateSchema = z.object({
	title: z.string().min(1),
	template: z.string().optional().default('')
});

export type createTemplateSchemaType = typeof createTemplateSchema;
