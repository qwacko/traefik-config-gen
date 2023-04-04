import { sourceUpdateValidation } from '$lib/schema/sourceSchema';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.sources.getSource(id);

	if (!currentData) {
		throw redirect(302, '/sources');
	}

	const form = superValidate(currentData, sourceUpdateValidation);

	return { source: currentData, form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, sourceUpdateValidation);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.trpc.sources.updateSource(form.data);
		} catch (e) {
			console.log('Update Source Error', e);
			return fail(400, { form: { ...form, message: 'Error Updating Source' } });
		}
		throw redirect(302, `/sources`);
	}
};
