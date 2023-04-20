import { z } from 'zod';

export const booleanSchemaFromString = (defaultValue: boolean) =>
	z
		.string()
		.transform(() => defaultValue)
		.or(z.boolean())
		.optional()
		.default(defaultValue);

export const sourceTypeOptions = ['Docker', 'Manual', 'YAML', 'Config'] as const;
type sourceTypeOptionsType = 'Docker' | 'Manual' | 'YAML' | 'Config';

const validateSourceTypeOptions = (val: string): sourceTypeOptionsType => {
	if (sourceTypeOptions.includes(val as sourceTypeOptionsType)) {
		return val as sourceTypeOptionsType;
	}
	return 'Manual';
};

export type sourceTypeDropdownType = { key: sourceTypeOptionsType; label: string }[];
export const sourceTypeDropdown: sourceTypeDropdownType = [
	{ key: 'Docker', label: 'Docker' },
	{ key: 'Manual', label: 'Manual' },
	{ key: 'YAML', label: 'YAML' }
];

export const sourceAddValidation = z.object({
	title: z.string(),
	type: z.enum(sourceTypeOptions).default('Manual'),
	address: z.string(),
	autoDelete: booleanSchemaFromString(false),
	autoUpdate: booleanSchemaFromString(false),
	enabled: booleanSchemaFromString(true),
	defaultRouterTemplateId: z.string().cuid(),
	defaultServiceTemplateId: z.string().cuid()
});

export type sourceAddValidationType = typeof sourceAddValidation;

export const sourceUpdateValidation = z.object({
	id: z.string().cuid(),
	title: z.string().optional(),
	type: z.enum(sourceTypeOptions).optional(),
	address: z.string().optional(),
	autoDelete: booleanSchemaFromString(false).optional(),
	autoUpdate: booleanSchemaFromString(false).optional(),
	enabled: booleanSchemaFromString(true).optional(),
	defaultRouterTemplateId: z.string().cuid().optional(),
	defaultServiceTemplateId: z.string().cuid().optional()
});

export type sourceUpdateValidationType = typeof sourceUpdateValidation;

export const sourceGetOutputValidationSingle = z.object({
	id: z.string().cuid(),
	title: z.string(),
	type: z.string().transform(validateSourceTypeOptions),
	identifier: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
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
