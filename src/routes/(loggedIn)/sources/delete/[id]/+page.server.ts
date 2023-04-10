import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.sources.getSource(id);

	if (!currentData || currentData._count.Host > 0) throw redirect(302, `/sources`);

	return { source: currentData };
};

export const actions = {
	default: async (event) => {
		const id = event.params.id;

		try {
			await event.locals.trpc.sources.deleteSource(id);
		} catch (e) {
			console.log('Delete Source Error', e);
			return { message: 'Delete Source Error' };
		}

		throw redirect(302, `/sources`);
	}
};
