import { z } from 'zod';

export const hostAddValidation = z.object({
	title: z.string(),
	identifier: z.string().optional(),
	lastSeen: z.date().optional().default(new Date()),
	sourceId: z.string().cuid(),
	routerTemplateId: z.string().cuid().optional().nullable(),
	serviceTemplateId: z.string().cuid().optional().nullable()
});

export type hostAddValidationType = typeof hostAddValidation;

export const hostUpdateValidation = z.object({
	id: z.string().cuid(),
	title: z.string().optional(),
	identifier: z.string().optional().nullable(),
	lastSeen: z.date().optional(),
	sourceId: z.string().cuid().optional(),
	routerTemplateId: z.string().cuid().optional().nullable(),
	serviceTemplateId: z.string().cuid().optional().nullable()
});

export type hostUpdateValidationType = typeof hostUpdateValidation;

export const hostSetParameterSchema = z.object({
	hostId: z.string().cuid(),
	label: z.string(),
	value: z.string()
});

export type hostSetParameterSchemaType = typeof hostSetParameterSchema;

export const hostRemoveParameterSchema = z.object({
	hostId: z.string().cuid(),
	label: z.string()
});

export type hostRemoveParameterSchemaType = typeof hostRemoveParameterSchema;
