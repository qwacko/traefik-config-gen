import type { Prisma, PrismaClient } from '@prisma/client';
import { debug } from '$lib/server/serverEnv';

type ConfigurationType = {
	title: string;
	routerTemplate?: string;
	serviceTemplate?: string;
	parameters?: Record<string, string>;
};

export const upsertHost = async ({
	prisma,
	identifier,
	sourceId,
	configuration,
	editable
}: {
	prisma: PrismaClient;
	identifier: string;
	sourceId?: string;
	configuration: ConfigurationType;
	editable?: boolean;
}) => {
	debug.trace('Upserting Host', { sourceId, editable, identifier, configuration });
	const routerTemplate = await prisma.routerTemplate.findFirst({
		where: {
			OR: [
				{ title: configuration.routerTemplate },
				{ identifier: `${identifier}-${configuration.routerTemplate}` }
			]
		}
	});

	const serviceTemplate = await prisma.serviceTemplate.findFirst({
		where: {
			OR: [
				{ title: configuration.serviceTemplate },
				{ identifier: `${identifier}-${configuration.serviceTemplate}` }
			]
		}
	});

	debug.trace('Found Existing Templates', { routerTemplate, serviceTemplate });

	const serviceTemplateId = serviceTemplate ? serviceTemplate.id : undefined;
	const routerTemplateId = routerTemplate ? routerTemplate.id : undefined;

	const updateHost = {
		title: configuration.title,
		lastSeen: new Date(),
		editable,
		service: serviceTemplateId
			? {
					connect: {
						id: serviceTemplateId
					}
			  }
			: undefined,
		router: routerTemplateId
			? {
					connect: {
						id: routerTemplateId
					}
			  }
			: undefined,
		source: sourceId ? { connect: { id: sourceId } } : undefined,
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
		source: { connect: { id: sourceId } }
	} satisfies Prisma.HostCreateInput;

	const host = await prisma.host.findFirst({
		where: { identifier, sourceId: sourceId },
		include: { parameters: true, router: true, source: true, service: true }
	});

	if (host) {
		debug.trace('Updating Host', { host, updateHost });
		await prisma.parameter.deleteMany({ where: { hostId: host.id } });
		await prisma.host.update({ where: { id: host.id }, data: updateHost });
	} else {
		debug.trace('Creating Host', { newHostCreation });
		await prisma.host.create({ data: newHostCreation });
	}
};

export const upsertHostsFromList = async ({
	prisma,
	sourceId,
	identifierId,
	hosts,
	editable = true
}: {
	prisma: PrismaClient;
	sourceId?: string;
	identifierId: string;
	hosts: Record<string, ConfigurationType> | undefined;
	editable?: boolean;
}) => {
	if (!hosts) return;
	for (const [key, value] of Object.entries(hosts)) {
		const identifier = `${identifierId}-${key}`;

		await upsertHost({
			identifier,
			sourceId,
			prisma: prisma,
			configuration: value,
			editable
		});
	}

	const identifiers = Object.entries(hosts).map(([key]) => `${sourceId}-${key}`);

	await prisma.host.deleteMany({
		where: { identifier: { notIn: identifiers }, sourceId: sourceId }
	});
};
