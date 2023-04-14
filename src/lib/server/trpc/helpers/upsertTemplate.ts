import type { PrismaClient } from '@prisma/client';

type TemplateConfig = { title: string; template: string; exampleData?: string };

export const upsertServiceTemplate = ({
	prisma,
	sourceId,
	identifier,
	template
}: {
	prisma: PrismaClient;
	sourceId: string;
	identifier: string;
	template: TemplateConfig;
}) => {
	return prisma.serviceTemplate.upsert({
		where: {
			identifier
		},
		update: template,
		create: {
			...template,
			masterSourceId: sourceId,
			identifier
		}
	});
};

export const upsertServiceTemplatesFromList = async ({
	serviceTemplates,
	prisma,
	sourceId
}: {
	serviceTemplates: Record<string, TemplateConfig>;
	prisma: PrismaClient;
	sourceId: string;
}) => {
	await Promise.all(
		Object.entries(serviceTemplates).map(async ([key, value]) => {
			const identifier = `${sourceId}-${key}`;

			await upsertServiceTemplate({
				identifier,
				sourceId,
				prisma: prisma,
				template: value
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
	template
}: {
	prisma: PrismaClient;
	sourceId: string;
	identifier: string;
	template: TemplateConfig;
}) => {
	return prisma.routerTemplate.upsert({
		where: {
			identifier
		},
		update: template,
		create: {
			...template,
			masterSourceId: sourceId,
			identifier
		}
	});
};

export const upsertRouterTemplatesFromList = async ({
	routerTemplates,
	prisma,
	sourceId
}: {
	routerTemplates: Record<string, TemplateConfig>;
	prisma: PrismaClient;
	sourceId: string;
}) => {
	await Promise.all(
		Object.entries(routerTemplates).map(async ([key, value]) => {
			const identifier = `${sourceId}-${key}`;

			console.log('Identifier', identifier);

			await upsertRouterTemplate({
				identifier,
				sourceId,
				prisma: prisma,
				template: value
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
