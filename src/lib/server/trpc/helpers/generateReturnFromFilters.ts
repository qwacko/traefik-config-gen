import { processTemplate } from '$lib/helpers/processTemplate';
import type { Prisma, PrismaClient } from '@prisma/client';
import { getHostVariables } from './getHostVariables';

export const generateReturnFromFilters = async ({
	filters,
	prisma
}: {
	filters: Prisma.HostWhereInput;
	prisma: PrismaClient;
}) => {
	const hosts = await prisma.host.findMany({
		where: filters,
		include: {
			router: true,
			service: true,
			source: { include: { defaultRouter: true, defaultService: true } },
			parameters: true
		},
		orderBy: [{ createdAt: 'desc' }]
	});
	const routerOutputs = await Promise.all(
		hosts.map(async (host) => {
			const router = host.router || host.source.defaultRouter;
			if (!router) return undefined;

			const variables = await getHostVariables({ host, prisma });
			const routerOutput = processTemplate({ template: router.template, variables });

			if (!routerOutput) return undefined;

			try {
				JSON.parse(routerOutput);
			} catch (e) {
				console.log('routerOutput', routerOutput);
			}

			return { [variables.TITLE.routerName]: JSON.parse(routerOutput) };
		})
	);

	const routerOutputObject = routerOutputs.reduce((acc, curr) => {
		if (!curr) return acc;
		return { ...acc, ...curr };
	}, {});

	const serviceOutputs = await Promise.all(
		hosts.map(async (host) => {
			const service = host.service || host.source.defaultService;
			if (!service) return undefined;

			const variables = await getHostVariables({ host, prisma });
			const serviceOutput = processTemplate({ template: service.template, variables });

			if (!serviceOutput) return undefined;

			return { [variables.TITLE.serviceName]: JSON.parse(serviceOutput) };
		})
	);

	const serviceOutputObject = serviceOutputs.reduce((acc, curr) => {
		if (!curr) return acc;
		return { ...acc, ...curr };
	}, {});

	return { http: { routers: routerOutputObject, services: serviceOutputObject } };
};
