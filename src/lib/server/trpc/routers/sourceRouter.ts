import { t } from '../t';
import { authMiddleware } from '../middleware/auth';
import z from 'zod';
import {
	sourceAddParameterSchema,
	sourceAddValidation,
	sourceGetOutputValidation,
	sourceGetOutputValidationSingle,
	sourceRemoveParameterSchema,
	sourceUpdateValidation
} from '$lib/schema/sourceSchema';
import { TRPCError } from '@trpc/server';
import { idSchema } from '$lib/schema/idSchema';
import { loadYAML } from '../helpers/loadYAML';

export const sourceRouter = t.router({
	getSource: t.procedure
		.use(authMiddleware)
		.input(z.string().cuid())
		.output(sourceGetOutputValidationSingle.nullable())
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.source.findUnique({
				where: { id: input },
				include: { _count: { select: { Host: true } }, parameters: true }
			});

			return data;
		}),
	getSources: t.procedure
		.use(authMiddleware)
		.output(sourceGetOutputValidation)
		.query(async ({ ctx }) => {
			const data = await ctx.prisma.source.findMany({
				include: { _count: { select: { Host: true } }, parameters: true }
			});
			return data;
		}),
	addSource: t.procedure
		.use(authMiddleware)
		.input(sourceAddValidation)
		.mutation(async ({ input: data, ctx }) => ctx.prisma.source.create({ data })),
	deleteSource: t.procedure
		.use(authMiddleware)
		.input(z.string().cuid())
		.mutation(async ({ ctx, input }) => {
			const source = await ctx.prisma.source.findFirst({
				where: { id: input },
				include: { _count: { select: { Host: true } } }
			});

			if (source && source._count.Host === 0) {
				await ctx.prisma.source.delete({ where: { id: input } });
			}
			return true;
		}),
	updateSource: t.procedure
		.use(authMiddleware)
		.input(sourceUpdateValidation)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.prisma.source.update({ where: { id }, data });
		}),
	refreshSource: t.procedure
		.use(authMiddleware)
		.input(idSchema)
		.mutation(async ({ ctx, input }) => {
			const source = await ctx.prisma.source.findUnique({ where: { id: input.id } });
			if (!source) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Source not found' });
			if (source.type !== 'YAML')
				throw new TRPCError({ code: 'BAD_REQUEST', message: 'Source is not a YAML file' });

			const { data, error } = await loadYAML(source.address);

			console.log('YAML Error', error);
			console.log('YAML Data', data);
		}),
	parameters: t.router({
		remove: t.procedure
			.use(authMiddleware)
			.input(sourceRemoveParameterSchema)
			.mutation(async ({ ctx, input }) => {
				const currentParameter = await ctx.prisma.parameter.findFirst({
					where: { sourceId: input.sourceId, label: input.label }
				});

				if (currentParameter) {
					await ctx.prisma.parameter.delete({
						where: { id: currentParameter.id }
					});
				}

				return true;
			}),
		set: t.procedure
			.use(authMiddleware)
			.input(sourceAddParameterSchema)
			.mutation(async ({ ctx, input }) => {
				const source = await ctx.prisma.source.findFirst({
					where: { id: input.sourceId }
				});

				if (!source) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Source not found' });

				const currentParameter = await ctx.prisma.parameter.findFirst({
					where: { sourceId: input.sourceId, label: input.label }
				});

				if (!currentParameter) {
					await ctx.prisma.parameter.create({
						data: { sourceId: input.sourceId, label: input.label, value: input.value }
					});
				} else {
					await ctx.prisma.parameter.update({
						where: { id: currentParameter.id },
						data: { value: input.value }
					});
				}

				return true;
			})
	})
});
