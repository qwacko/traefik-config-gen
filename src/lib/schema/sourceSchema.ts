import { z } from 'zod';

const sourceTypeOptions = ['docker', 'manual', 'yaml', 'other'] as const;
const sourceTypeOptionsEditable = [...sourceTypeOptions];

export const sourceAddValidation = z.object({
	title: z.string(),
	type: z.enum(sourceTypeOptions),
	address: z.string(),
	autoDelete: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(false),
	enabled: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(true),
	parameters: z.string().optional(),
	// .object({})
	// .catchall(z.string())
	// .transform((data) => JSON.stringify(data))
	// .optional(),
	defaultRouterTemplateId: z.string().cuid().optional(),
	defaultServiceTemplateId: z.string().cuid().optional()
});

export type sourceAddValidationType = typeof sourceAddValidation;

export const sourceUpdateValidation = z.object({
	id: z.string().cuid(),
	title: z.string(),
	type: z.enum(sourceTypeOptions),
	address: z.string(),
	autoDelete: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(false),
	enabled: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(true),
	defaultRouterTemplateId: z.string().cuid().optional(),
	defaultServiceTemplateId: z.string().cuid().optional()
});

export const sourceGetOutputValidationSingle = z.object({
	id: z.string().cuid(),
	title: z.string(),
	type: z
		.string()
		.superRefine((val, ctx) => {
			if (!sourceTypeOptions.includes(val as (typeof sourceTypeOptionsEditable)[0])) {
				const options = [...sourceTypeOptions];
				ctx.addIssue({
					message: `Incorrect Type ${val}`,
					code: 'invalid_enum_value',
					path: ctx.path,
					fatal: true,
					options,
					received: val
				});
			}
		})
		.transform((val) => {
			const data = sourceTypeOptions.reduce((prev, current) => {
				if (val === current) {
					return current;
				}
				return prev;
			}, 'docker');
			return data;
		}),
	address: z.string(),
	autoDelete: z.boolean(),
	enabled: z.boolean(),
	parameters: z
		.string()
		.transform((data) => JSON.parse(data))
		.optional()
		.nullable(),
	defaultRouterTemplateId: z.string().cuid().optional().nullable(),
	defaultServiceTemplateId: z.string().cuid().optional().nullable(),
	lastUpdated: z.date().optional().nullable()
});

export const sourceGetOutputValidation = z.array(sourceGetOutputValidationSingle);

export type SourceOutput = z.infer<typeof sourceGetOutputValidationSingle>;
