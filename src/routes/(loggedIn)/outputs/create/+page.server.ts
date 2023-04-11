import { createOutputSchema } from '$lib/schema/outputSchema';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async () => {
	const form = await superValidate(createOutputSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, createOutputSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.trpc.outputs.create(form.data);
			return { form };
		} catch (e) {
			console.log('Create Output Error: ', e);
			return fail(400, { form });
		}
	}
};
