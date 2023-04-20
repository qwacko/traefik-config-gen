import { serverEnv } from '$lib/server/serverEnv';
import { promises as fs } from 'fs';
import { configSchema } from '$lib/schema/configSchema';
import { parse, stringify } from 'yaml';
import type { PrismaClient } from '@prisma/client';
import { defaultConfig } from './defaultConfig';
import { upsertRouterTemplatesFromList, upsertServiceTemplatesFromList } from './upsertTemplate';
import { upsertHostsFromList } from './upsertHost';
import { upsertConfigSources } from './upsertConfigSources';

const initialiseConfig = async (configFilePath: string) => {
	const configValidated = configSchema.safeParse(defaultConfig);
	if (!configValidated.success) {
		throw new Error('Config file is invalid');
	}

	const configString = stringify(configValidated.data);

	await fs.writeFile(configFilePath, configString);
};

export const initialiseConfigIfNotExists = async () => {
	const configFilePath = serverEnv.CONFIG_FILE;
	try {
		await fs.stat(configFilePath);
	} catch (error) {
		console.log('Config File Not Found. Initialising', error);
		await initialiseConfig(configFilePath);
	}
};

export const updateFromConfig = async ({ prisma }: { prisma: PrismaClient }) => {
	//Check if config file exists, and if not then call a funciton to initialise it
	const configFilePath = serverEnv.CONFIG_FILE;

	await initialiseConfigIfNotExists();

	let parsedData: unknown;

	try {
		const fileContents = await fs.readFile(configFilePath, 'utf8');
		parsedData = parse(fileContents);
	} catch (error) {
		console.log('YAML Load Error', error);
		return { error: 'Invalid YAML or File Location' };
	}

	const validatedData = configSchema.safeParse(parsedData);

	if (!validatedData.success) {
		console.log('Config Validation Error', validatedData.error);
		return {
			error: "Config Data Doesn't Match Required Strucutre",
			errorDetail: validatedData.error
		};
	}

	console.log('Parsed Config', validatedData.data);
	const sources = await prisma.source.findMany();
	if (sources.length === 0) {
		console.log('No Sources Found. Creating Default Source');
	}

	await upsertConfigSources({ prisma, config: validatedData.data });
	await upsertServiceTemplatesFromList({
		prisma,
		serviceTemplates: validatedData.data.serviceTemplates,
		editable: false,
		identifierId: 'config'
	});
	await upsertRouterTemplatesFromList({
		prisma,
		routerTemplates: validatedData.data.routerTemplates,
		editable: false,
		identifierId: 'config'
	});

	await upsertHostsFromList({
		prisma,
		hosts: validatedData.data.hosts,
		editable: false,
		identifierId: 'config'
	});
};
