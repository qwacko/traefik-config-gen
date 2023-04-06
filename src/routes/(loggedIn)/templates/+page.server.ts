export const load = async (event) => {
	const { routerTemplates, serviceTemplates } = await event.locals.trpc.templates.getAll();

	return { routerTemplates, serviceTemplates };
};
