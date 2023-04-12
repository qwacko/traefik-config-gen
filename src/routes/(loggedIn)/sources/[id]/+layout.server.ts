import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.sources.getSource(id);

	if (!currentData) {
		throw redirect(302, '/sources');
	}

	const hosts = (await event.locals.trpc.hosts.getHosts()).filter((h) => h.sourceId === id);

	return { source: currentData, hosts };
};
