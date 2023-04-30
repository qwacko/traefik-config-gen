import { z } from 'zod';

export const updateOutputSchema = z.object({
	id: z.string().cuid(),
	title: z.string().optional(),
	address: z.string().optional(),
	autoUpdate: z.boolean().optional().default(false),
	includedHosts: z.array(z.string().cuid()).optional().default([]),
	excludedHosts: z.array(z.string().cuid()).optional().default([]),
	includedSources: z.array(z.string().cuid()).optional().default([]),
	excludedSources: z.array(z.string().cuid()).optional().default([])
});

export type UpdateOutputSchemaType = typeof updateOutputSchema;

export const createOutputSchema = z.object({
	title: z.string(),
	address: z.string(),
	currentOutput: z.string(),
	autoUpdate: z.boolean().optional()
});

export type CreateOutputSchemaType = typeof createOutputSchema;

export const updateOutputCurrentSchema = z.object({
	outputId: z.string().cuid(),
	outputText: z.string(),
	changeTitle: z.string()
});

export type UpdateOutputCurrentSchemaType = typeof updateOutputCurrentSchema;
