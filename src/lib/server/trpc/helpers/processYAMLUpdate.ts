import type { PrismaClient, Source } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { loadYAML } from './loadYAML';
import { upsertHostsFromList } from './upsertHost';
import { upsertRouterTemplatesFromList, upsertServiceTemplatesFromList } from './upsertTemplate';

export const processYAMLUpdate = async ({
	prisma,
	source
}: {
	prisma: PrismaClient;
	source: Source;
}) => {
	if (source.type !== 'YAML') return;
	const { data, error } = await loadYAML(source.address);

	if (error) {
		await prisma.source.update({
			where: { id: source.id },
			data: { lastRefreshErrors: error, lastRefreshErrorsDate: new Date() }
		});
	} else if (data) {
		try {
			//Loop through all services and upsert servie templates taht exist, and remove those that dont.
			await upsertRouterTemplatesFromList({
				prisma,
				sourceId: source.id,
				routerTemplates: data.routerTemplate,
				editable: false
			});
		} catch (e) {
			console.log(e);
			await prisma.source.update({
				where: { id: source.id },
				data: {
					lastRefreshErrors: 'Error Updating Router Templates',
					lastRefreshErrorsDate: new Date()
				}
			});
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Error Updating Router Templates'
			});
		}
		try {
			await upsertServiceTemplatesFromList({
				prisma,
				sourceId: source.id,
				serviceTemplates: data.serviceTemplate,
				editable: false
			});
		} catch (e) {
			console.log(e);
			await prisma.source.update({
				where: { id: source.id },
				data: {
					lastRefreshErrors: 'Error Updating Service Templates',
					lastRefreshErrorsDate: new Date()
				}
			});
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Error Updating Service Templates'
			});
		}

		try {
			// Loop through hosts and create / update / delete them
			await upsertHostsFromList({
				prisma,
				source,
				hosts: data.hosts,
				editable: false
			});
		} catch (e) {
			console.log(e);

			await prisma.source.update({
				where: { id: source.id },
				data: {
					lastRefreshErrors: 'Error Updating Hosts',
					lastRefreshErrorsDate: new Date()
				}
			});
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'Error Updating Hosts'
			});
		}

		await prisma.source.update({
			where: { id: source.id },
			data: {
				lastRefreshErrors: null,
				lastRefreshErrorsDate: null,
				lastRefresh: new Date(),
				lastRefreshData: JSON.stringify(data)
			}
		});
	}
};
