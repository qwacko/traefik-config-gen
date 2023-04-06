import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';
import { t } from '../t';

type TemplateTypes = 'router' | 'service';
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
	get: t.procedure
		.use(authMiddleware)
		.output(z.array(templateReturn.strict()))
		.query(async ({ ctx }) => {
			const routerTemplates = await ctx.db.routerTemplate.findMany();
			const serviceTemplates = await ctx.db.serviceTemplate.findMany();

			const returnData = [
				...routerTemplates.map((item) => ({
					...item,
					type: 'router' as TemplateTypes
				})),
				...serviceTemplates.map((item) => ({
					...item,
					type: 'service' as TemplateTypes
				}))
			].sort((a, b) => a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase()));

			return returnData;
		}),
	create: t.procedure
		.use(authMiddleware)
		.input(
			z.object({
				title: z.string(),
				template: z.string(),
				type: z.enum(templateTypeOptions),
				exampleData: z.string().optional()
			})
		)
		.output(templateReturn)
		.mutation(async ({ ctx, input }) => {
			const { type, ...data } = input;
			if (type === 'router') {
				const newItem = await ctx.db.routerTemplate.create({ data });
				return { ...newItem, type: 'router' };
			} else {
				const newItem = await ctx.db.serviceTemplate.create({ data });
				return { ...newItem, type: 'service' };
			}
		}),
	update: t.procedure
		.use(authMiddleware)
		.input(
			z.object({
				id: z.string().cuid(),
				title: z.string().optional(),
				template: z.string().optional(),
				exampleData: z.string().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...data } = input;

			const targetRouter = await ctx.db.routerTemplate.findUnique({
				where: { id }
			});
			const targetService = await ctx.db.serviceTemplate.findUnique({
				where: { id }
			});

			if (!targetRouter && !targetService) {
				throw new TRPCError({ message: 'Cannot find id', code: 'BAD_REQUEST' });
			} else if (targetRouter) {
				await ctx.db.routerTemplate.update({ where: { id }, data: { ...data } });
			} else {
				await ctx.db.serviceTemplate.update({ where: { id }, data });
			}
			return true;
		}),
	delete: t.procedure
		.use(authMiddleware)
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.routerTemplate.delete({ where: { id: input.id } });
			await ctx.db.serviceTemplate.delete({ where: { id: input.id } });
		})
});
