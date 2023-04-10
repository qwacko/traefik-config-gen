import { z } from 'zod';

const sourceTypeOptions = ['docker', 'manual', 'yaml', 'other'] as const;
type sourceTypeOptionsType = 'docker' | 'manual' | 'yaml' | 'other';

export type sourceTypeDropdownType = { key: sourceTypeOptionsType; label: string }[];
export const sourceTypeDropdown: sourceTypeDropdownType = [
	{ key: 'docker', label: 'Docker' },
	{ key: 'manual', label: 'Manual' },
	{ key: 'yaml', label: 'YAML' },
	{ key: 'other', label: 'Other' }
];

const sourceTypeOptionsEditable = [...sourceTypeOptions];

export const sourceAddValidation = z.object({
	title: z.string(),
	type: z.enum(sourceTypeOptions).default('manual'),
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
	defaultRouterTemplateId: z.string().cuid().optional().nullable(),
	defaultServiceTemplateId: z.string().cuid().optional().nullable()
});

export type sourceUpdateValidationType = typeof sourceUpdateValidation;

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
		.array(z.object({ id: z.string().cuid(), label: z.string(), value: z.string() }))
		.optional()
		.nullable(),
	defaultRouterTemplateId: z.string().cuid().optional().nullable(),
	defaultServiceTemplateId: z.string().cuid().optional().nullable(),
	lastUpdated: z.date().optional().nullable(),
	_count: z.object({ Host: z.number() })
});

export const sourceGetOutputValidation = z.array(sourceGetOutputValidationSingle);

export type SourceOutput = z.infer<typeof sourceGetOutputValidationSingle>;

export const sourceAddParameterSchema = z.object({
	sourceId: z.string().cuid(),
	label: z.string(),
	value: z.string()
});

export type sourceAddParameterSchemaType = typeof sourceAddParameterSchema;

export const sourceRemoveParameterSchema = z.object({
	sourceId: z.string().cuid(),
	label: z.string()
});

export type sourceRemoveParameterSchemaType = typeof sourceRemoveParameterSchema;

export const sourceUpdateParameterSchema = sourceAddParameterSchema;

export type sourceUpdateParameterSchemaType = typeof sourceUpdateParameterSchema;
