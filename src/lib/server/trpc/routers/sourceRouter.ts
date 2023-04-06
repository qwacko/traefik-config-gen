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
			const data = await ctx.prisma.source.findUnique({ where: { id: input } });

			return data;
		}),
	getSources: t.procedure
		.use(authMiddleware)
		.output(sourceGetOutputValidation)
		.query(async ({ ctx }) => {
			const data = await ctx.prisma.source.findMany();
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
			await ctx.prisma.source.delete({ where: { id: input } });
			return true;
		}),
	updateSource: t.procedure
		.use(authMiddleware)
		.input(sourceUpdateValidation)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;
			return ctx.prisma.source.update({ where: { id }, data });
		}),
	getSourceRawData: t.procedure
		.use(authMiddleware)
		.input(z.object({ id: z.string().cuid() }))
		.query(async () => {
			return {};

			// const source = await ctx.prisma.source.findUniqueOrThrow({
			// 	where: { id: input.id }
			// });

			// const sourceType = source.type;
			// const sourceAddress = source.address;

			// if (sourceType === 'docker') {
			// 	try {
			// 		const returnData = await getDockerInformation({
			// 			socketPath: sourceAddress
			// 		});
			// 		return returnData;
			// 	} catch (e) {
			// 		throw new TRPCError({
			// 			message: 'Error Getting Data From Socket',
			// 			code: 'BAD_REQUEST'
			// 		});
			// 	}
			// }
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
