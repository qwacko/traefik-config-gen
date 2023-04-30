import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.sources.getSource(id);

	if (!currentData) {
		throw redirect(302, '/sources');
	}

	const hosts = (await event.locals.trpc.hosts.getHosts()).filter((h) => h.sourceId === id);
	const { routerTemplates, serviceTemplates } = await event.locals.trpc.templates.getAll();

	return {
		source: currentData,
		hosts,
		routerTemplates: routerTemplates.map((item) => ({ key: item.id, label: item.title })),
		serviceTemplates: serviceTemplates.map((item) => ({ key: item.id, label: item.title })),
		routerTemplatesComplete: routerTemplates.filter((item) => item.masterSourceId === id),
		serviceTemplatesComplete: serviceTemplates.filter((item) => item.masterSourceId === id)
	};
};
