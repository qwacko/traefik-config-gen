import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { dev } from '$app/environment';

const serverEnvValidation = z
	.object({
		ORIGIN: z.string().url().optional(),
		HTTPS: z.coerce.boolean(),
		DEV: z.coerce.boolean(),
		CSRF_CHECK_ORIGIN: z.coerce.boolean(),
		CONFIG_FILE: z.string().optional().default('./config.yaml'),
		DEBUG: z.coerce.boolean().optional(),
		// DEBUG_CLASSES is a string containing an array of logging levels to enable ("ERROR","WARN","INFO","DEBUG","TRACE")
		DEBUG_CLASSES: z
			.string()
			.optional()
			.default('ERROR,WARN,INFO')
			.transform((data) => data.split(',').map((d) => d.trim().toUpperCase()))
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
	CSRF_CHECK_ORIGIN: env.CSRF_CHECK_ORIGIN,
	CONFIG_FILE: env.CONFIG_FILE,
	DEBUG: env.DEBUG,
	DEBUG_CLASSES: env.DEBUG_CLASSES
});

type logClasses = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';
type logParams = Parameters<typeof console.log>;
export const debugFunction = (logClass: logClasses = 'INFO', ...params: logParams) => {
	if (serverEnv.DEBUG) console.log(logClass, ...params);
};

export const debug = {
	error: (...params: logParams) => {
		if (serverEnv.DEBUG_CLASSES.includes('ERROR')) debugFunction('ERROR', ...params);
	},
	warn: (...params: logParams) => {
		if (serverEnv.DEBUG_CLASSES.includes('WARN')) debugFunction('WARN', ...params);
	},
	info: (...params: logParams) => {
		if (serverEnv.DEBUG_CLASSES.includes('INFO')) debugFunction('INFO', ...params);
	},
	debug: (...params: logParams) => {
		if (serverEnv.DEBUG_CLASSES.includes('DEBUG')) debugFunction('DEBUG', ...params);
	},
	trace: (...params: logParams) => {
		if (serverEnv.DEBUG_CLASSES.includes('TRACE')) debugFunction('TRACE', ...params);
	}
};

debug.info('Server Environment:', serverEnv);
