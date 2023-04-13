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

const templateYAMLSchema = z.record(
	z.object({
		title: z.string(),
		template: stringOrObjectSchema,
		exampleData: stringOrObjectSchema
	})
);

export const yamlDataSchema = z.object({
	routerTemplate: templateYAMLSchema,
	serviceTemplate: templateYAMLSchema,
	hosts: z.record(
		z.object({
			title: z.string(),
			parameters: z
				.record(
					z
						.string()
						.or(z.number())
						.transform((value) => {
							if (typeof value === 'string') {
								return value;
							}
							return value.toString();
						})
				)
				.optional(),
			routerTemplate: z.string().optional(),
			serviceTemplate: z.string().optional()
		})
	)
});
