import { env } from '$env/dynamic/public';
import type { Host, PrismaClient } from '@prisma/client';

export const getHostVariables = async ({ host, prisma }: { host: Host; prisma: PrismaClient }) => {
	const hostVariables = JSON.parse(host.parameters || '{}') as Record<string, string>;

	const source = await prisma.source.findUnique({ where: { id: host.sourceId } });
	const sourceVariables = (source ? JSON.parse(source.parameters || '{}') : {}) as Record<
		string,
		string
	>;

	return { PUBLIC: env as Record<string, string>, HOST: hostVariables, SOURCE: sourceVariables };
};
