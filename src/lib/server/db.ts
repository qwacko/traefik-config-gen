import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

const setSetupWAL = async () => {
	const result = (await prisma.$queryRaw(Prisma.sql`PRAGMA journal_mode;`)) as {
		journal_mode: string;
	}[];
	if (result[0].journal_mode === 'wal') console.log('WAL mode already enabled');
	else {
		await prisma.$queryRaw(Prisma.sql`PRAGMA journal_mode=WAL;`);
		console.log('SQLite WAL mode enabled');
	}
};

setSetupWAL();
