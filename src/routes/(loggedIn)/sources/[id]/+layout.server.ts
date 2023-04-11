import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.sources.getSource(id);

	if (!currentData) {
		throw redirect(302, '/sources');
	}
	return { source: currentData };
};
