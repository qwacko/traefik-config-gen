import { z } from 'zod';
import { booleanSchemaFromString, sourceTypeOptions } from './sourceSchema';
import { singleLevelRecordSchema, yamlDataSchema } from './yamlDataSchema';

export const configSchema = z
	.object({
		sources: z.record(
			z.object({
				title: z.string(),
				type: z.enum(sourceTypeOptions).default('Manual'),
				address: z.string().optional(),
				autoDelete: booleanSchemaFromString(false),
				autoUpdate: booleanSchemaFromString(false),
				enabled: booleanSchemaFromString(true),
				parameters: singleLevelRecordSchema.optional().default({}),
				routerTemplate: z.string(),
				serviceTemplate: z.string()
			})
		)
	})
	.merge(yamlDataSchema);

export type configSchemaType = z.input<typeof configSchema>;
export type configOutputSchemaType = z.infer<typeof configSchema>;
