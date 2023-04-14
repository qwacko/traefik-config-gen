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
	configuration,
	editable
}: {
	prisma: PrismaClient;
	identifier: string;
	source: Source;
	configuration: ConfigurationType;
	editable?: boolean;
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
		editable,
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
		editable,
		source: { connect: { id: source.id } }
	} satisfies Prisma.HostCreateInput;

	const host = await prisma.host.findFirst({
		where: { identifier, sourceId: source.id },
		include: { parameters: true, router: true, source: true, service: true }
	});

	if (host) {
		await prisma.parameter.deleteMany({ where: { hostId: host.id } });
		await prisma.host.update({ where: { id: host.id }, data: updateHost });
	} else {
		await prisma.host.create({ data: newHostCreation });
	}
};

export const upsertHostsFromList = async ({
	prisma,
	source,
	hosts,
	editable = true
}: {
	prisma: PrismaClient;
	source: Source;
	hosts: Record<string, ConfigurationType>;
	editable?: boolean;
}) => {
	for (const [key, value] of Object.entries(hosts)) {
		const identifier = `${source.id}-${key}`;

		console.log('Starting Upserting Host', { key, value });

		await upsertHost({
			identifier,
			source,
			prisma: prisma,
			configuration: value,
			editable
		});
	}

	const identifiers = Object.entries(hosts).map(([key]) => `${source.id}-${key}`);

	await prisma.host.deleteMany({
		where: { identifier: { notIn: identifiers }, sourceId: source.id }
	});
};
