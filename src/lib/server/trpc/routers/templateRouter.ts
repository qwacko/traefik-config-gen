import { createTemplateSchema, updateTempateSchema } from '$lib/schema/templateSchema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { t } from '../t';

const templateTypeOptions = ['router', 'service'] as const;

const templateReturn = z.object({
	id: z.string().cuid(),
	identifier: z.string().nullable(),
	title: z.string(),
	template: z.string(),
	exampleData: z.string().nullable(),
	type: z.enum(templateTypeOptions),
	masterSourceId: z.string().cuid().optional().nullable(),
	editable: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	_count: z.object({ Host: z.number(), Source: z.number() })
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
				await ctx.prisma.routerTemplate.findMany({
					orderBy: { title: 'asc' },
					include: { _count: { select: { Host: true, Source: true } } }
				})
			).map((item) => ({
				...item,
				type: 'router' as const
			}));
			const serviceTemplates = (
				await ctx.prisma.serviceTemplate.findMany({
					orderBy: { title: 'asc' },
					include: { _count: { select: { Host: true, Source: true } } }
				})
			).map((item) => ({
				...item,
				type: 'service' as const
			}));

			return { routerTemplates, serviceTemplates };
		}),

	get: t.procedure
		.use(authMiddleware)
		.input(z.object({ id: z.string().cuid() }))
		.output(templateReturn.strict().nullable())
		.query(async ({ ctx, input }) => {
			const routerTemplate = await ctx.prisma.routerTemplate.findUnique({
				where: { id: input.id },
				include: { _count: { select: { Host: true, Source: true } } }
			});

			if (routerTemplate) {
				return { ...routerTemplate, type: 'router' as const };
			}

			const serviceTemplate = await ctx.prisma.serviceTemplate.findUnique({
				where: { id: input.id },
				include: { _count: { select: { Host: true, Source: true } } }
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
			const targetRouter = await ctx.prisma.routerTemplate.findUnique({
				where: { id: input.id },
				include: { _count: { select: { Host: true, Source: true } } }
			});
			const targetService = await ctx.prisma.serviceTemplate.findUnique({
				where: { id: input.id },
				include: { _count: { select: { Host: true, Source: true } } }
			});

			// Make sure that the template is not in use
			if (targetRouter && targetRouter._count.Host === 0 && targetRouter._count.Source === 0) {
				await ctx.prisma.routerTemplate.deleteMany({ where: { id: input.id } });
			}

			// Make sure that the template is not in use
			if (targetService && targetService._count.Host === 0 && targetService._count.Source === 0) {
				await ctx.prisma.serviceTemplate.deleteMany({ where: { id: input.id } });
			}
		})
});
