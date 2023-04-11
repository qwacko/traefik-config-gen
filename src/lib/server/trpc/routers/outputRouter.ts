import { idSchema } from '$lib/schema/idSchema';
import {
	createOutputSchema,
	updateOutputCurrentSchema,
	updateOutputSchema
} from '$lib/schema/outputSchema';
import { TRPCError } from '@trpc/server';
import { authMiddleware } from '../middleware/auth';
import { t } from '../t';

export const outputRouter = t.router({
	getAll: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
		const data = await ctx.prisma.outputConfig.findMany({
			include: { outputHistory: { where: { current: true } } }
		});

		return data;
	}),
	get: t.procedure
		.use(authMiddleware)
		.input(idSchema)
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.outputConfig.findUnique({
				where: { id: input.id },
				include: {
					outputHistory: { take: 10, orderBy: [{ current: 'desc' }, { createdAt: 'desc' }] },
					includedHosts: true,
					excludedHosts: true,
					includedSources: true,
					excludedSources: true
				}
			});

			if (!data) throw new TRPCError({ code: 'NOT_FOUND' });

			return data;
		}),
	getAllHistory: t.procedure
		.use(authMiddleware)
		.input(idSchema)
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.outputHistory.findMany({
				where: { configId: input.id },
				orderBy: { createdAt: 'desc' }
			});
			return data;
		}),
	create: t.procedure
		.use(authMiddleware)
		.input(createOutputSchema)
		.mutation(async ({ ctx, input }) => {
			const data = await ctx.prisma.outputConfig.create({ data: input });
			return data;
		}),
	update: t.procedure
		.use(authMiddleware)
		.input(updateOutputSchema)
		.mutation(async ({ ctx, input }) => {
			const {
				id,
				includedHosts: inclHosts,
				excludedHosts: exclHosts,
				includedSources: inclSources,
				excludedSources: exclSources,
				...tempData
			} = input;
			const output = await ctx.prisma.outputConfig.findUnique({ where: { id } });
			if (!output) throw new TRPCError({ code: 'NOT_FOUND' });

			const includedHosts = inclHosts ? { set: inclHosts?.map((id) => ({ id })) } : undefined;
			const excludedHosts = exclHosts ? { set: exclHosts?.map((id) => ({ id })) } : undefined;
			const includedSources = inclSources ? { set: inclSources?.map((id) => ({ id })) } : undefined;
			const excludedSources = exclSources ? { set: exclSources?.map((id) => ({ id })) } : undefined;

			const data = { ...tempData, includedHosts, excludedHosts, includedSources, excludedSources };

			const updated = await ctx.prisma.outputConfig.update({ where: { id }, data });

			return updated;
		}),
	delete: t.procedure
		.use(authMiddleware)
		.input(idSchema)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.$transaction([
				ctx.prisma.outputConfig.delete({ where: { id: input.id } }),
				ctx.prisma.outputHistory.deleteMany({ where: { configId: input.id } })
			]);
		}),
	updateCurrent: t.procedure
		.use(authMiddleware)
		.input(updateOutputCurrentSchema)
		.mutation(async ({ ctx, input }) => {
			const { outputId, outputText, changeTitle } = input;
			const output = await ctx.prisma.outputConfig.findUnique({ where: { id: outputId } });
			if (!output) throw new TRPCError({ code: 'NOT_FOUND' });

			await ctx.prisma.$transaction([
				ctx.prisma.outputHistory.updateMany({
					where: { configId: outputId },
					data: { current: false }
				}),
				ctx.prisma.outputHistory.create({
					data: { configId: outputId, output: outputText, changeTitle, current: true }
				})
			]);
		}),
	generateOutput: t.procedure.input(idSchema).query(async ({ ctx, input }) => {
		const output = await ctx.prisma.outputConfig.findUnique({
			where: { id: input.id },
			include: {
				excludedHosts: true,
				includedHosts: true,
				excludedSources: true,
				includedSources: true
			}
		});

		return `Output Testing : ${output?.title}`;
	})
});
