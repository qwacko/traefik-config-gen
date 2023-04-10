import Handlebars, { templates } from 'handlebars';
export const processTemplate = <Error extends string>({
	template,
	variables,
	errorReturn
}: {
	template: string | undefined;
	variables: Record<string, string | Record<string, string>> | string | null | undefined;
	errorReturn?: Error;
}) => {
	if (!template) return errorReturn;

	const processed = Handlebars.compile(template);
	try {
		const useVariables = variables
			? typeof variables === 'string'
				? JSON.parse(variables)
				: variables
			: {};
		const result = processed(useVariables);
		return result;
	} catch (e) {
		return errorReturn;
	}
};

export const getVariableGroups = (templatesInformation: string[]) => {
	const templateInformation = templatesInformation.join(' ');

	const regex = /{{([^}])*}}/g;

	// const regex = /{{[^\}]*}}/;
	const matches = templateInformation.match(regex);
	if (!matches) return [];
	const groups = matches.map((match) => {
		const group = match.replace('{{', '').replace('}}', '').trim();
		return group;
	});
	return [...new Set(groups)].sort((a, b) => a.localeCompare(b));
};
