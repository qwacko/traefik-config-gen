import { auth } from '$lib/server/lucia.js';
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
			await auth.deleteUser(id);
		} catch (e) {
			console.log('Delete User Error', e);
			return { message: 'Delete User Error' };
		}

		throw redirect(302, `/users`);
	}
};
