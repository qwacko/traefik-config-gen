import { createOutputSchema } from '$lib/schema/outputSchema';
import { fail, redirect } from '@sveltejs/kit';
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

		let id = '';

		try {
			const newOutput = await event.locals.trpc.outputs.create(form.data);
			id = newOutput.id;
		} catch (e) {
			console.log('Create Output Error: ', e);
			return fail(400, { form });
		}
		throw redirect(302, `/outputs/${id}/edit`);
	}
};
