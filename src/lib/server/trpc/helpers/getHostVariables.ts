import { env } from '$env/dynamic/public';
import type { Host, PrismaClient, Parameter } from '@prisma/client';

export const getHostVariables = async ({
	host,
	prisma
}: {
	host: Host & { parameters: Parameter[] };
	prisma: PrismaClient;
}) => {
	const uniqueName = host.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
	const serviceName = `${uniqueName}_service`;
	const routerName = `${uniqueName}_router`;

	const TITLE = { uniqueName, serviceName, routerName };

	const hostVariables = host.parameters.reduce((acc, parameter) => {
		acc[parameter.label] = parameter.value;
		return acc;
	}, {} as Record<string, string>);

	const source = await prisma.source.findUnique({
		where: { id: host.sourceId },
		include: { parameters: true }
	});
	const sourceVariables = source
		? source.parameters.reduce((acc, parameter) => {
				acc[parameter.label] = parameter.value;
				return acc;
		  }, {} as Record<string, string>)
		: ({} as Record<string, string>);

	return {
		PUBLIC: env as Record<string, string>,
		HOST: hostVariables,
		SOURCE: sourceVariables,
		TITLE
	};
};
