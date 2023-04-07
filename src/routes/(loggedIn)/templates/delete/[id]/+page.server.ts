import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.templates.get({ id });

	if (!currentData) throw redirect(302, `/templates`);

	return { template: currentData };
};

export const actions = {
	default: async (event) => {
		const id = event.params.id;

		try {
			await event.locals.trpc.templates.delete({ id });
		} catch (e) {
			console.log('Delete Template Error', e);
			return { message: 'Delete Template Error' };
		}

		throw redirect(302, `/templates`);
	}
};
