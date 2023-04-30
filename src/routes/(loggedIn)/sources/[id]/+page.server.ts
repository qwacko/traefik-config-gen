import { idSchema } from '$lib/schema/idSchema';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const actions = {
	refresh: async (event) => {
		const form = await superValidate(event, idSchema);

		if (!form.valid) {
			return fail(400);
		}

		try {
			await event.locals.trpc.sources.refreshSource(form.data);
		} catch (e) {
			console.log('Refresh Error', e);
			return fail(400);
		}
	}
};
