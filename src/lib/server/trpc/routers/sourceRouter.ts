import { t } from '../t';
import { authMiddleware } from '../middleware/auth';
import z from 'zod';
import {
	sourceAddValidation,
	sourceGetOutputValidation,
	sourceUpdateValidation
} from '$lib/schema/sourceSchema';
// import { getDockerInformation } from '$lib/server/docker/getDockerInformation';
// import { TRPCError } from '@trpc/server';

export const sourceRouter = t.router({
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
		updateParameters: t.procedure
			.use(authMiddleware)
			.input(
				z.object({
					id: z.string().cuid(),
					data: z.object({}).catchall(z.string())
				})
			)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.id }
				});

				const currentParameters = current.parameters
					? (JSON.parse(current.parameters) as Record<string, string>)
					: undefined;

				const newParameters = { ...currentParameters, ...input.data };

				await ctx.prisma.source.update({
					where: { id: input.id },
					data: { parameters: JSON.stringify(newParameters) }
				});
				return true;
			}),

		removeParameter: t.procedure
			.use(authMiddleware)
			.input(
				z.object({
					label: z.string(),
					id: z.string().cuid()
				})
			)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.id }
				});

				const newParameters = current.parameters ? JSON.parse(current.parameters) : undefined;

				if (newParameters) {
					delete newParameters[input.label];
					await ctx.prisma.source.update({
						where: { id: input.id },
						data: { parameters: JSON.stringify(newParameters) }
					});
				}
				return true;
			}),
		addParameter: t.procedure
			.use(authMiddleware)
			.input(
				z.object({
					label: z.string(),
					value: z.string(),
					id: z.string().cuid()
				})
			)
			.mutation(async ({ ctx, input }) => {
				const current = await ctx.prisma.source.findFirstOrThrow({
					where: { id: input.id }
				});

				const newParameters = current.parameters
					? { ...JSON.parse(current.parameters), [input.label]: input.value }
					: { [input.label]: input.value };

				await ctx.prisma.source.update({
					where: { id: input.id },
					data: { parameters: JSON.stringify(newParameters) }
				});
				return true;
			})
	})
});
