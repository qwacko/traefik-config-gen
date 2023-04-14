import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const parentData = await event.parent();

	if (!parentData.host.editable) throw redirect(302, `/hosts/${parentData.host.id}`);
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
