import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const serverEnvValidation = z
	.object({
		ORIGIN: z.string().url().optional(),
		HTTPS: z.coerce.boolean(),
		DEV: z.coerce.boolean(),
		CSRF_CHECK_ORIGIN: z.coerce.boolean(),
		CONFIG_FILE: z.string().optional().default('./config.yaml')
	})
	.transform((data) => ({
		...data,
		LUCIADEV: (data.DEV ? 'DEV' : data.HTTPS ? 'PROD' : 'DEV') as 'DEV' | 'PROD',
		ORIGINS: data.ORIGIN ? data.ORIGIN.split(',') : undefined
	}));

export const serverEnv = serverEnvValidation.parse({
	ORIGIN: env.ORIGIN,
	HTTPS: env.HTTPS,
	DEV: dev,
	CSRF_CHECK_ORIGIN: process.env.CSRF_CHECK_ORIGIN,
	CONFIG_FILE: env.CONFIG_FILE
});
