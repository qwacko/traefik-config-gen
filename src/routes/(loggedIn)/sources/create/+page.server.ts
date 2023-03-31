import { superValidate } from 'sveltekit-superforms/server';
import { sourceAddValidation } from '$lib/schema/sourceSchema';
import { fail } from '@sveltejs/kit';

export const load = async (event) => {
	const form = await superValidate(event, sourceAddValidation);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, sourceAddValidation);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.trpc.sources.addSource(form.data);

			return { form };
		} catch {
			return fail(400, { form: { ...form, message: 'Error Creating Source' } });
		}
	}
};
