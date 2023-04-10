import Handlebars from 'handlebars';
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

export const getVariableGroups = (templateInformation: string) => {
	// extract a list of text strings matching {{.*SOURCE.*}} from templateInformation
	const regex = /{{.*SOURCE\..*}}/g;
	const matches = templateInformation.match(regex);
	if (!matches) return [];
	const groups = matches.map((match) => {
		const group = match.replace('{{', '').replace('}}', '');
		return group.trim();
	});
	return groups;
};
