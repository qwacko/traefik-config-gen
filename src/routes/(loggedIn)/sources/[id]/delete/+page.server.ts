import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const parentData = await event.parent();
	const id = event.params.id;

	if (parentData.source._count.Host > 0) throw redirect(302, `/sources/${id}`);
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
