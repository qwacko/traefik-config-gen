import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.hosts.get({ id });

	if (!currentData) throw redirect(302, `/hosts`);

	return { host: currentData };
};

export const actions = {
	default: async (event) => {
		const id = event.params.id;

		try {
			await event.locals.trpc.hosts.delete({ id });
		} catch (e) {
			console.log('Delete Host Error', e);
			return { message: 'Delete Host Error' };
		}

		throw redirect(302, `/hosts`);
	}
};
