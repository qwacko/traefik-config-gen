import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.users.getUserInfo(id);

	if (!currentData) throw redirect(302, `/users`);

	return { user: currentData };
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
