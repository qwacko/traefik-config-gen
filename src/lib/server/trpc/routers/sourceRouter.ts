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
import { upsertHostsFromList } from '../helpers/upsertHost';
import {
	upsertRouterTemplatesFromList,
	upsertServiceTemplatesFromList
} from '../helpers/upsertTemplate';

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
			if (source.type === 'Manual')
				throw new TRPCError({ code: 'BAD_REQUEST', message: "Manual source can't be refreshed" });

			if (source.type === 'YAML') {
				const { data, error } = await loadYAML(source.address);

				if (error) {
					await ctx.prisma.source.update({
						where: { id: source.id },
						data: { lastRefreshErrors: error, lastRefreshErrorsDate: new Date() }
					});
				} else if (data) {
					try {
						//Loop through all services and upsert servie templates taht exist, and remove those that dont.
						await upsertRouterTemplatesFromList({
							prisma: ctx.prisma,
							sourceId: source.id,
							routerTemplates: data.routerTemplate,
							editable: false
						});
					} catch (e) {
						console.log(e);
						await ctx.prisma.source.update({
							where: { id: source.id },
							data: {
								lastRefreshErrors: 'Error Updating Router Templates',
								lastRefreshErrorsDate: new Date()
							}
						});
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Error Updating Router Templates'
						});
					}
					try {
						await upsertServiceTemplatesFromList({
							prisma: ctx.prisma,
							sourceId: source.id,
							serviceTemplates: data.serviceTemplate,
							editable: false
						});
					} catch (e) {
						console.log(e);
						await ctx.prisma.source.update({
							where: { id: source.id },
							data: {
								lastRefreshErrors: 'Error Updating Service Templates',
								lastRefreshErrorsDate: new Date()
							}
						});
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Error Updating Service Templates'
						});
					}

					try {
						// Loop through hosts and create / update / delete them
						await upsertHostsFromList({
							prisma: ctx.prisma,
							source,
							hosts: data.hosts,
							editable: false
						});
					} catch (e) {
						console.log(e);

						await ctx.prisma.source.update({
							where: { id: source.id },
							data: {
								lastRefreshErrors: 'Error Updating Hosts',
								lastRefreshErrorsDate: new Date()
							}
						});
						throw new TRPCError({
							code: 'BAD_REQUEST',
							message: 'Error Updating Hosts'
						});
					}

					await ctx.prisma.source.update({
						where: { id: source.id },
						data: {
							lastRefreshErrors: null,
							lastRefreshErrorsDate: null,
							lastRefresh: new Date(),
							lastRefreshData: JSON.stringify(data)
						}
					});
				}
			}
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
