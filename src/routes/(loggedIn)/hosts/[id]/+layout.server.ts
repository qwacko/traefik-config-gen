import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentDataPromise = await event.locals.trpc.hosts.get({ id });

	const sourcesRaw = event.locals.trpc.sources.getSources();
	const templatesRaw = event.locals.trpc.templates.getAll();
	const currentData = await currentDataPromise;

	if (!currentData) throw redirect(302, '/hosts');

	const sources = (await sourcesRaw).map((source) => ({ key: source.id, label: source.title }));
	const routerTemplates = (await templatesRaw).routerTemplates.map((template) => ({
		key: template.id,
		label: template.title
	}));
	const serviceTemplates = (await templatesRaw).serviceTemplates.map((template) => ({
		key: template.id,
		label: template.title
	}));

	return { host: currentData, sources, routerTemplates, serviceTemplates };
};
