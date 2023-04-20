import { z } from 'zod';

const stringOrObjectSchema = z
	.string()
	.or(z.record(z.any()))
	.transform((value) => {
		if (typeof value === 'string') {
			return value;
		}
		return JSON.stringify(value);
	});

export const singleLevelRecordSchema = z.record(
	z
		.string()
		.or(z.number())
		.transform((value) => {
			if (typeof value === 'string') {
				return value;
			}
			return value.toString();
		})
);

const templateYAMLSchema = z.record(
	z.object({
		title: z.string(),
		template: stringOrObjectSchema,
		exampleData: stringOrObjectSchema.optional().default('')
	})
);

export const yamlDataSchema = z.object({
	routerTemplates: templateYAMLSchema.optional(),
	serviceTemplates: templateYAMLSchema.optional(),
	hosts: z
		.record(
			z.object({
				title: z.string(),
				parameters: singleLevelRecordSchema.optional().default({}),
				routerTemplate: z.string().optional(),
				serviceTemplate: z.string().optional()
			})
		)
		.optional()
});
