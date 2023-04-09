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
