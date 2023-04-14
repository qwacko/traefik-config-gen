import type { Prisma, PrismaClient, Source } from '@prisma/client';

type ConfigurationType = {
	title: string;
	routerTemplate?: string;
	serviceTemplate?: string;
	parameters?: Record<string, string>;
};

export const upsertHost = async ({
	prisma,
	identifier,
	source,
	configuration
}: {
	prisma: PrismaClient;
	identifier: string;
	source: Source;
	configuration: ConfigurationType;
}) => {
	const routerTemplate = await prisma.routerTemplate.findFirst({
		where: {
			OR: [
				{ title: configuration.routerTemplate },
				{ identifier: `${source.id}-${configuration.routerTemplate}` }
			]
		}
	});

	const serviceTemplate = await prisma.serviceTemplate.findFirst({
		where: {
			OR: [
				{ title: configuration.routerTemplate },
				{ identifier: `${source.id}-${configuration.routerTemplate}` }
			]
		}
	});

	const serviceTemplateId = serviceTemplate ? serviceTemplate.id : source.defaultServiceTemplateId;
	const routerTemplateId = routerTemplate ? routerTemplate.id : source.defaultRouterTemplateId;

	console.log('Service / Router Ids', { serviceTemplateId, routerTemplateId });

	const updateHost = {
		title: configuration.title,
		lastSeen: new Date(),
		service: {
			connect: {
				id: serviceTemplateId
			}
		},
		router: {
			connect: {
				id: routerTemplateId
			}
		},
		parameters: configuration.parameters
			? {
					create: Object.entries(configuration.parameters).map(([pKey, pItem]) => ({
						label: pKey,
						value: pItem
					}))
			  }
			: undefined
	} satisfies Prisma.HostUpdateInput;

	const newHostCreation = {
		...updateHost,
		identifier,
		source: { connect: { id: source.id } }
	} satisfies Prisma.HostCreateInput;

	const host = await prisma.host.findFirst({
		where: { identifier, sourceId: source.id },
		include: { parameters: true, router: true, source: true, service: true }
	});

	console.log('Host Found');

	if (host) {
		console.log('Host Found, Deleting Parameters');
		console.log('Host Id', host.id);
		const numDeleted = await prisma.parameter.deleteMany({ where: { hostId: host.id } });
		console.log('Deleted Parameters', numDeleted);
		await prisma.host.update({ where: { id: host.id }, data: updateHost });
	} else {
		console.log('Host Not Found, Creating Host');
		await prisma.host.create({ data: newHostCreation });
	}
	console.log('Completed Updating Host', { updateHost, newHostCreation });
};

export const upsertHostsFromList = async ({
	prisma,
	source,
	hosts
}: {
	prisma: PrismaClient;
	source: Source;
	hosts: Record<string, ConfigurationType>;
}) => {
	for (const [key, value] of Object.entries(hosts)) {
		const identifier = `${source.id}-${key}`;

		console.log('Starting Upserting Host', { key, value });

		await upsertHost({
			identifier,
			source,
			prisma: prisma,
			configuration: value
		});
	}

	const identifiers = Object.entries(hosts).map(([key]) => `${source.id}-${key}`);

	await prisma.host.deleteMany({
		where: { identifier: { notIn: identifiers }, sourceId: source.id }
	});
};
