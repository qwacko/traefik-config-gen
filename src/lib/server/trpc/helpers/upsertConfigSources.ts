import type { configOutputSchemaType } from '$lib/schema/configSchema';
import type { Prisma, PrismaClient } from '@prisma/client';

export const upsertConfigSources = async ({
	prisma,
	config
}: {
	prisma: PrismaClient;
	config: configOutputSchemaType;
}) => {
	if (!config.routerTemplates || !config.serviceTemplates) return;
	// Deletes all sources that are not in the config file and are of type "Config"
	const sourcesToDelete = await prisma.source.findMany({
		where: {
			type: 'Config',
			identifier: {
				notIn: Object.entries(config.sources).map(([key]) => `config-${key}`)
			}
		},
		select: {
			_count: {
				select: { ownedRouterTemplates: true, ownedServiceTemplates: true, Host: true }
			},
			title: true
		}
	});

	for (const source of sourcesToDelete) {
		if (
			source._count.ownedRouterTemplates > 0 ||
			source._count.ownedServiceTemplates > 0 ||
			source._count.Host > 0
		) {
			throw new Error(`Cannot delete source as it is in use - ${source.title}`);
		}
	}

	await prisma.source.deleteMany({
		where: {
			type: 'Config'
			// identifier: {
			// 	notIn: Object.entries(config.sources).map(([key]) => `config-${key}`)
			// }
		}
	});

	//Using For rather than object map to reduce risk of connection issues to SQLite DB (Makes this sequential rather than parallel)
	for (const [key, value] of Object.entries(config.sources)) {
		const defaultService = config.routerTemplates[value.serviceTemplate];
		const defaultRouter = config.serviceTemplates[value.routerTemplate];
		if (!defaultService || !defaultRouter) throw new Error('Default Service or Router not found');

		const updateValue = {
			title: value.title,
			address: value.address,
			autoDelete: value.autoDelete,
			enabled: true,
			identifier: `config-${key}`,
			autoUpdate: value.autoUpdate,
			defaultService: {
				connectOrCreate: {
					where: { identifier: `config-${value.serviceTemplate}` },
					create: {
						...defaultService
					}
				}
			},
			defaultRouter: {
				connectOrCreate: {
					where: { identifier: `config-${value.routerTemplate}` },
					create: {
						...defaultRouter
					}
				}
			},
			type: 'Config'
		} satisfies Prisma.SourceUpdateInput;

		const createValue = {
			...updateValue
		} satisfies Prisma.SourceCreateInput;

		console.log('Upserting Source', JSON.stringify(updateValue, undefined, 2));

		await prisma.source.upsert({
			where: { identifier: `config-${key}` },
			update: updateValue,
			create: createValue
		});
	}
};
