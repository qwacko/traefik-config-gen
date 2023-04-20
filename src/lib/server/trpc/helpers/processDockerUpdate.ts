import { yamlDataSchema } from '$lib/schema/yamlDataSchema';
import type { PrismaClient, Source } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import Docker from 'dockerode';
import { upsertHostsFromList } from './upsertHost';
import { upsertRouterTemplatesFromList, upsertServiceTemplatesFromList } from './upsertTemplate';

const loadDocker = async ({ address, source }: { address: string; source: Source }) => {
	try {
		const docker = new Docker({ socketPath: address });

		const containers = await docker.listContainers();
		const filteredContainers = containers
			.filter((item) => {
				const labels = Object.keys(item.Labels);
				const retain = labels.reduce((acc, label) => {
					if (label.startsWith('traefikConfigGen.')) {
						return true;
					}
					return acc;
				}, false);

				return retain;
			})
			.reduce((prev, item) => {
				const foundName = item.Names[0].replace('/', '');
				const replacedName = foundName && foundName.length > 0 ? foundName : item.Id;
				const title = `${replacedName} (${source.title})`;
				const identifier = `${source.id}-${replacedName}`;
				const parameters = Object.keys(item.Labels)
					.filter(
						(label) =>
							label.startsWith('traefikConfigGen.') &&
							!label.startsWith('traefikConfigGen.serviceTemplateName') &&
							!label.startsWith('traefikConfigGen.routerTemplateName')
					)
					.reduce<Record<string, string>>((acc, label) => {
						const key = label.replace('traefikConfigGen.', '');
						const value = item.Labels[label];
						return { ...acc, [key]: value };
					}, {});
				const serviceTemplate = Object.keys(item.Labels).find((label) =>
					label.startsWith('traefikConfigGen.serviceTemplateName')
				)
					? item.Labels['traefikConfigGen.serviceTemplateName']
					: undefined;
				const routerTemplate = Object.keys(item.Labels).find((label) =>
					label.startsWith('traefikConfigGen.routerTemplateName')
				)
					? item.Labels['traefikConfigGen.routerTemplateName']
					: undefined;

				return {
					...prev,
					[identifier]: { title, parameters, serviceTemplate, routerTemplate }
				};
			}, {});
		const validatedData = yamlDataSchema.safeParse({ hosts: filteredContainers });

		if (!validatedData.success) {
			console.error('Docker Data Load Error', JSON.stringify(validatedData.error, null, 2));
			return { data: undefined, error: 'Error Loading Data, incorrect format' };
		}

		return { data: validatedData.data, error: undefined };
	} catch (e) {
		console.log('Docker Data Load Error', e);
		return { data: undefined, error: 'Error Loading Docker Data' };
	}
};

export const processDockerUpdate = async ({
	prisma,
	source
}: {
	prisma: PrismaClient;
	source: Source;
}) => {
	if (source.type !== 'Docker' || !source.address) return;

	const { data, error } = await loadDocker({ address: source.address, source });

	if (error) {
		await prisma.source.update({
			where: { id: source.id },
			data: { lastRefreshErrors: error, lastRefreshErrorsDate: new Date() }
		});
	} else if (data) {
		try {
			if (data.routerTemplates) {
				//Loop through all services and upsert servie templates taht exist, and remove those that dont.
				await upsertRouterTemplatesFromList({
					prisma,
					sourceId: source.id,
					routerTemplates: data.routerTemplates,
					editable: false
				});
			}
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
			if (data.serviceTemplates) {
				await upsertServiceTemplatesFromList({
					prisma,
					sourceId: source.id,
					serviceTemplates: data.serviceTemplates,
					editable: false
				});
			}
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
				identifierId: source.id,
				sourceId: source.id,
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
