import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const parentData = await event.parent();
	const currentData = parentData.template;

	if (!currentData || currentData._count.Host > 0 || currentData._count.Source > 0) {
		throw redirect(302, `/templates`);
	}
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
