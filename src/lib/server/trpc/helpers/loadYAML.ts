import { yamlDataSchema } from '$lib/schema/yamlDataSchema';
import { parse } from 'yaml';
import { promises as fs } from 'fs';

export const loadYAML = async (yamlPath: string) => {
	let parsedData: unknown;

	try {
		const fileContents = await fs.readFile(yamlPath, 'utf8');
		parsedData = parse(fileContents);
	} catch (error) {
		console.log('YAML Load Error', error);
		return { error: 'Invalid YAML or File Location' };
	}

	const validatedData = yamlDataSchema.safeParse(parsedData);

	if (!validatedData.success) {
		console.log('YAML Validation Error', validatedData.error);
		return {
			error: "YAML Data Doesn't Match Required Strucutre",
			errorDetail: validatedData.error
		};
	}

	return { data: validatedData.data };
};
