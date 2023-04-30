import type { PrismaClient } from '@prisma/client';

type TemplateConfig = { title: string; template: string; exampleData?: string };

export const upsertServiceTemplate = ({
	prisma,
	sourceId,
	identifier,
	template,
	editable = true
}: {
	prisma: PrismaClient;
	sourceId?: string;
	identifier: string;
	template: TemplateConfig;
	editable?: boolean;
}) => {
	return prisma.serviceTemplate.upsert({
		where: {
			identifier
		},
		update: { ...template, editable },
		create: {
			...template,
			editable,
			masterSourceId: sourceId,
			identifier
		}
	});
};

export const upsertServiceTemplatesFromList = async ({
	serviceTemplates,
	prisma,
	sourceId,
	identifierId,
	editable = true
}: {
	serviceTemplates: Record<string, TemplateConfig> | undefined;
	prisma: PrismaClient;
	sourceId?: string;
	identifierId?: string;
	editable?: boolean;
}) => {
	if (!serviceTemplates) return;
	await Promise.all(
		Object.entries(serviceTemplates).map(async ([key, value]) => {
			const identifier = identifierId
				? `${identifierId}-${key}`
				: sourceId
				? `${sourceId}-${key}`
				: key;

			await upsertServiceTemplate({
				identifier,
				sourceId,
				prisma: prisma,
				template: value,
				editable
			});
		})
	);

	const serviceTemplateIdentifiers = Object.entries(serviceTemplates).map(
		([key]) => `${sourceId}-${key}`
	);

	await prisma.serviceTemplate.deleteMany({
		where: { identifier: { notIn: serviceTemplateIdentifiers }, masterSourceId: sourceId }
	});
};

export const upsertRouterTemplate = ({
	prisma,
	sourceId,
	identifier,
	template,
	editable = true
}: {
	prisma: PrismaClient;
	sourceId?: string;
	identifier: string;
	template: TemplateConfig;
	editable?: boolean;
}) => {
	return prisma.routerTemplate.upsert({
		where: {
			identifier
		},
		update: { ...template, editable },
		create: {
			...template,
			editable,
			masterSourceId: sourceId,
			identifier
		}
	});
};

export const upsertRouterTemplatesFromList = async ({
	routerTemplates,
	prisma,
	sourceId,
	identifierId,
	editable = true
}: {
	routerTemplates: Record<string, TemplateConfig> | undefined;
	prisma: PrismaClient;
	sourceId?: string;
	identifierId?: string;
	editable?: boolean;
}) => {
	if (!routerTemplates) return;
	await Promise.all(
		Object.entries(routerTemplates).map(async ([key, value]) => {
			const identifier = identifierId
				? `${identifierId}-${key}`
				: sourceId
				? `${sourceId}-${key}`
				: key;

			console.log('Identifier', identifier);

			await upsertRouterTemplate({
				identifier,
				sourceId,
				prisma: prisma,
				template: value,
				editable
			});
		})
	);

	const routerTemplateIdentifiers = Object.entries(routerTemplates).map(
		([key]) => `${sourceId}-${key}`
	);

	await prisma.routerTemplate.deleteMany({
		where: { identifier: { notIn: routerTemplateIdentifiers }, masterSourceId: sourceId }
	});
};
