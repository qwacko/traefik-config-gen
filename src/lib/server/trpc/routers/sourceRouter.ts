import { t } from '../t';
import { authMiddleware } from '../middleware/auth';
import z from 'zod';
import {
	sourceAddParameterSchema,
	sourceAddValidation,
	sourceGetOutputValidation,
	sourceGetOutputValidationSingle,
	sourceRemoveParameterSchema,
	sourceUpdateParameterSchema,
	sourceUpdateValidation
} from '$lib/schema/sourceSchema';

export const sourceRouter = t.router({
	getSource: t.procedure
		.use(authMiddleware)
		.input(z.string().cuid())
		.output(sourceGetOutputValidationSingle.nullable())
		.query(async ({ ctx, input }) => {
			const data = await ctx.prisma.source.findUnique({
				where: { id: input },
				include: { _count: { select: { Host: true } } }
			});

			return data;
		}),
	getSources: t.procedure
		.use(authMiddleware)
		.output(sourceGetOutputValidation)
		.query(async ({ ctx }) => {
			const data = await ctx.prisma.source.findMany({
				include: { _count: { select: { Host: true } } }
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
	parameters: t.router({
		updateParameter: t.procedure
			.use(authMiddleware)
			.input(sourceUpdateParameterSchema)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.sourceId }
				});

				const newParameters = current.parameters ? JSON.parse(current.parameters) : undefined;

				if (newParameters) {
					newParameters[input.label] = input.value;
					await ctx.prisma.source.update({
						where: { id: input.sourceId },
						data: { parameters: JSON.stringify(newParameters) }
					});
				}
				return true;
			}),

		removeParameter: t.procedure
			.use(authMiddleware)
			.input(sourceRemoveParameterSchema)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.sourceId }
				});

				const newParameters = current.parameters ? JSON.parse(current.parameters) : undefined;

				if (newParameters) {
					delete newParameters[input.label];
					await ctx.prisma.source.update({
						where: { id: input.sourceId },
						data: { parameters: JSON.stringify(newParameters) }
					});
				}
				return true;
			}),
		addParameter: t.procedure
			.use(authMiddleware)
			.input(sourceAddParameterSchema)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.sourceId }
				});

				const newParameters = current.parameters
					? { ...JSON.parse(current.parameters), [input.label]: input.value }
					: { [input.label]: input.value };

				await ctx.prisma.source.update({
					where: { id: input.sourceId },
					data: { parameters: JSON.stringify(newParameters) }
				});
				return true;
			})
	})
});
