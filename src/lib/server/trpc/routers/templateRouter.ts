import { createTemplateSchema, updateTempateSchema } from '$lib/schema/templateSchema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { t } from '../t';

const templateTypeOptions = ['router', 'service'] as const;

const templateReturn = z.object({
	id: z.string().cuid(),
	title: z.string(),
	template: z.string(),
	exampleData: z.string().nullable(),
	type: z.enum(templateTypeOptions),
	masterSourceId: z.string().cuid().optional().nullable(),
	editable: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date()
});

export type TemplateReturnType = z.infer<typeof templateReturn>;

export const templateRouter = t.router({
	getAll: t.procedure
		.use(authMiddleware)
		.output(
			z.object({
				routerTemplates: z.array(templateReturn.strict()),
				serviceTemplates: z.array(templateReturn.strict())
			})
		)
		.query(async ({ ctx }) => {
			const routerTemplates = (
				await ctx.prisma.routerTemplate.findMany({ orderBy: { title: 'asc' } })
			).map((item) => ({
				...item,
				type: 'router' as const
			}));
			const serviceTemplates = (
				await ctx.prisma.serviceTemplate.findMany({ orderBy: { title: 'asc' } })
			).map((item) => ({
				...item,
				type: 'service' as const
			}));

			return { routerTemplates, serviceTemplates };
		}),

	get: t.procedure
		.use(authMiddleware)
		.input(z.object({ id: z.string().cuid() }))
		.query(async ({ ctx, input }) => {
			const routerTemplate = await ctx.prisma.routerTemplate.findUnique({
				where: { id: input.id }
			});

			if (routerTemplate) {
				return { ...routerTemplate, type: 'router' as const };
			}

			const serviceTemplate = await ctx.prisma.serviceTemplate.findUnique({
				where: { id: input.id }
			});

			if (serviceTemplate) {
				return { ...serviceTemplate, type: 'service' as const };
			}

			return null;
		}),

	createRouter: t.procedure
		.use(authMiddleware)
		.input(createTemplateSchema)
		.mutation(async ({ ctx, input }) => {
			const newItem = await ctx.prisma.routerTemplate.create({ data: input });
			return newItem;
		}),
	createService: t.procedure
		.use(authMiddleware)
		.input(createTemplateSchema)
		.mutation(async ({ ctx, input }) => {
			const newItem = await ctx.prisma.serviceTemplate.create({ data: input });
			return newItem;
		}),

	update: t.procedure
		.use(authMiddleware)
		.input(updateTempateSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			const targetRouter = await ctx.prisma.routerTemplate.findUnique({
				where: { id }
			});
			const targetService = await ctx.prisma.serviceTemplate.findUnique({
				where: { id }
			});

			if (!targetRouter && !targetService) {
				throw new TRPCError({ message: 'Cannot find id', code: 'BAD_REQUEST' });
			} else if (targetRouter) {
				await ctx.prisma.routerTemplate.update({ where: { id }, data });
			} else {
				await ctx.prisma.serviceTemplate.update({ where: { id }, data });
			}
			return true;
		}),
	delete: t.procedure
		.use(authMiddleware)
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.routerTemplate.delete({ where: { id: input.id } });
			await ctx.prisma.serviceTemplate.delete({ where: { id: input.id } });
		})
});
