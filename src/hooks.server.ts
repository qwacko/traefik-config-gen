import { prisma } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
import { createContext } from '$lib/server/trpc/context';
import { router } from '$lib/server/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';
import url from 'url';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const user = await event.locals.auth.validate();

	if (event.route.id?.startsWith('/(loggedIn)') && !user) {
		console.log('User Not Logged In - Redirecting to Login');
		return Response.redirect(`${event.url.origin}/login`, 302);
	}

	if (event.route.id?.startsWith('/(loggedOut)') && user) {
		console.log('User Logged In - Redirecting to Sources');
		return Response.redirect(`${event.url.origin}/sources`, 302);
	}

	return await resolve(event);
};

const trpcInEvent: Handle = async ({ event, resolve }) => {
	const trpcCaller = router.createCaller(await createContext(event));
	event.locals.trpc = trpcCaller;
	return await resolve(event);
};

const checkOutput: Handle = async ({ event, resolve }) => {
	// Only execute if the address is not a route. AVoids overhead when not necessary
	if (!event.route.id) {
		const outputAddressses = await prisma.outputConfig.findMany({
			select: { id: true, address: true }
		});
		const targetAddress = url.parse(event.request.url).pathname;
		const outputConfig = outputAddressses.find((o) => `/${o.address}` === targetAddress);

		if (outputConfig) {
			const outputText = await prisma.outputHistory.findFirst({
				where: { configId: outputConfig.id, current: true },
				orderBy: { createdAt: 'desc' }
			});
			return new Response(outputText?.output || '');
		}
	}

	return await resolve(event);
};

export const handle = sequence(
	checkOutput,
	authHandler,
	createTRPCHandle({ router, createContext }),
	trpcInEvent
);
