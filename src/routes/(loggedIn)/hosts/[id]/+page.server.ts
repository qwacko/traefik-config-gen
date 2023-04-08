import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.hosts.get({ id });

	if (!currentData) throw redirect(302, `/hosts`);

	return { host: currentData };
};
