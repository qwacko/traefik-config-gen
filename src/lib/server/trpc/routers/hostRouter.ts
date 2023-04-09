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
		const hosts = await ctx.prisma.host.findMany();
		return hosts;
	}),
	get: t.procedure.input(z.object({ id: z.string().cuid() })).query(async ({ ctx, input }) => {
		const host = await ctx.prisma.host.findUnique({
			where: { id: input.id },
			include: { source: true, router: true, service: true }
		});

		if (!host) {
			return host;
		}

		const parametersObject = host.parameters
			? (JSON.parse(host.parameters) as Record<string, string>)
			: null;

		const variables = await getHostVariables({ host, prisma: ctx.prisma });

		return { ...host, parametersObject, variables };
	}),
	add: t.procedure.input(hostAddValidation).mutation(async ({ ctx, input }) => {
		const host = await ctx.prisma.host.create({
			data: { ...input, identifier: input.identifier || input.title }
		});
		return host;
	}),
	update: t.procedure.input(hostUpdateValidation).mutation(async ({ ctx, input }) => {
		console.log('inputData', input);
		const host = await ctx.prisma.host.update({ where: { id: input.id }, data: input });
		return host;
	}),
	delete: t.procedure
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.host.delete({ where: { id: input.id } });
			return true;
		}),
	parameters: t.router({
		set: t.procedure.input(hostSetParameterSchema).mutation(async ({ ctx, input }) => {
			const host = await ctx.prisma.host.findUnique({ where: { id: input.hostId } });

			if (!host) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Host not found' });

			const parameters = JSON.parse(host.parameters || '{}');

			parameters[input.label] = input.value;

			await ctx.prisma.host.update({
				where: { id: input.hostId },
				data: { parameters: JSON.stringify(parameters) }
			});

			return true;
		}),
		remove: t.procedure.input(hostRemoveParameterSchema).mutation(async ({ ctx, input }) => {
			const host = await ctx.prisma.host.findUnique({ where: { id: input.hostId } });

			if (!host) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Host not found' });

			const parameters = JSON.parse(host.parameters || '{}');

			delete parameters[input.label];

			await ctx.prisma.host.update({
				where: { id: input.hostId },
				data: { parameters: JSON.stringify(parameters) }
			});

			return true;
		})
	})
});
