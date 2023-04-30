import { idSchema } from '$lib/schema/idSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const form = await superValidate({ id: event.params.id }, idSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, idSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.trpc.outputs.delete(form.data);
		} catch (e) {
			console.log('Update Output Error: ', e);
			return fail(400, {
				form: { ...form, message: 'Error Deleting Output' }
			});
		}
		throw redirect(302, `/outputs`);
	}
};
