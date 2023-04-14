import { z } from 'zod';

const sourceTypeOptions = ['Docker', 'Manual', 'YAML', 'Other'] as const;
type sourceTypeOptionsType = 'Docker' | 'Manual' | 'YAML' | 'Other';

const validateSourceTypeOptions = (val: string): sourceTypeOptionsType => {
	if (sourceTypeOptions.includes(val as sourceTypeOptionsType)) {
		return val as sourceTypeOptionsType;
	}
	return 'Other';
};

export type sourceTypeDropdownType = { key: sourceTypeOptionsType; label: string }[];
export const sourceTypeDropdown: sourceTypeDropdownType = [
	{ key: 'Docker', label: 'Docker' },
	{ key: 'Manual', label: 'Manual' },
	{ key: 'YAML', label: 'YAML' },
	{ key: 'Other', label: 'Other' }
];

export const sourceAddValidation = z.object({
	title: z.string(),
	type: z.enum(sourceTypeOptions).default('Manual'),
	address: z.string(),
	autoDelete: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(false),
	autoUpdate: z
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
	defaultRouterTemplateId: z.string().cuid(),
	defaultServiceTemplateId: z.string().cuid()
});

export type sourceAddValidationType = typeof sourceAddValidation;

export const sourceUpdateValidation = z.object({
	id: z.string().cuid(),
	title: z.string(),
	type: z.enum(sourceTypeOptions).optional(),
	address: z.string(),
	autoDelete: z
		.string()
		.transform(() => true)
		.or(z.boolean())
		.optional()
		.default(false),
	autoUpdate: z
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

export type sourceUpdateValidationType = typeof sourceUpdateValidation;

export const sourceGetOutputValidationSingle = z.object({
	id: z.string().cuid(),
	title: z.string(),
	type: z.string().transform(validateSourceTypeOptions),
	address: z.string(),
	autoDelete: z.boolean(),
	autoUpdate: z.boolean(),
	enabled: z.boolean(),
	parameters: z
		.array(z.object({ id: z.string().cuid(), label: z.string(), value: z.string() }))
		.optional()
		.nullable(),
	defaultRouterTemplateId: z.string().cuid(),
	defaultServiceTemplateId: z.string().cuid(),
	lastRefresh: z.date().nullable(),
	lastRefreshData: z.string().nullable(),
	lastRefreshErrors: z.string().nullable(),
	lastRefreshErrorsDate: z.date().nullable(),
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
