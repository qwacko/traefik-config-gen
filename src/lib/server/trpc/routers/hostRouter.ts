import {
	hostSetParameterSchema,
	hostAddValidation,
	hostUpdateValidation,
	hostRemoveParameterSchema
} from '$lib/schema/hostSchema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getHostVariables } from '../helpers/getHostVariables';
import { t } from '../t';

export const hostRouter = t.router({
	getHosts: t.procedure.query(async ({ ctx }) => {
		const hosts = await ctx.prisma.host.findMany({ include: { parameters: true, source: true } });
		return hosts;
	}),
	get: t.procedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
		const host = await ctx.prisma.host.findUnique({
			where: { id: input.id },
			include: { source: true, router: true, service: true, parameters: true }
		});

		if (!host) {
			return host;
		}

		const variables = await getHostVariables({ host, prisma: ctx.prisma });

		return { ...host, variables };
	}),
	add: t.procedure.input(hostAddValidation).mutation(async ({ ctx, input }) => {
		const host = await ctx.prisma.host.create({
			data: { ...input, identifier: input.identifier || input.title }
		});
		return host;
	}),
	update: t.procedure.input(hostUpdateValidation).mutation(async ({ ctx, input }) => {
		await ctx.prisma.host.updateMany({ where: { id: input.id, editable: true }, data: input });
		return true;
	}),
	delete: t.procedure
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.host.deleteMany({ where: { id: input.id, editable: true } });
			return true;
		}),
	parameters: t.router({
		set: t.procedure.input(hostSetParameterSchema).mutation(async ({ ctx, input }) => {
			const host = await ctx.prisma.host.findUnique({ where: { id: input.hostId } });

			if (!host) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Host not found' });

			const currentParameter = await ctx.prisma.parameter.findFirst({
				where: { hostId: input.hostId, label: input.label }
			});

			if (currentParameter) {
				await ctx.prisma.parameter.update({
					where: { id: currentParameter.id },
					data: { value: input.value }
				});
			} else {
				await ctx.prisma.parameter.create({
					data: { hostId: input.hostId, label: input.label, value: input.value }
				});
			}

			return true;
		}),
		remove: t.procedure.input(hostRemoveParameterSchema).mutation(async ({ ctx, input }) => {
			await ctx.prisma.parameter.deleteMany({ where: input });

			return true;
		})
	})
});
