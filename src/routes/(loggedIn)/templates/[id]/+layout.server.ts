import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.templates.get({ id });

	if (!currentData) {
		throw redirect(302, '/templates');
	}

	const hosts = (await event.locals.trpc.hosts.getHosts()).filter(
		(h) => h.routerTemplateId === id || h.serviceTemplateId === id
	);

	return { template: currentData, hosts };
};
