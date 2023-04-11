import { updateOutputSchema, type UpdateOutputSchemaType } from '$lib/schema/outputSchema';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { z } from 'zod';

export const load = async (event) => {
	const { output: currentData } = await event.parent();

	const newCurrentData: z.infer<UpdateOutputSchemaType> = {
		id: currentData.id,
		address: currentData.address,
		title: currentData.title,
		autoUpdate: currentData.autoUpdate,
		includedHosts: currentData.includedHosts.map((host) => host.id),
		excludedHosts: currentData.excludedHosts.map((host) => host.id),
		includedSources: currentData.includedSources.map((source) => source.id),
		excludedSources: currentData.excludedSources.map((source) => source.id)
	};

	const form = await superValidate(newCurrentData, updateOutputSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, updateOutputSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.trpc.outputs.update(form.data);
			return { form };
		} catch (e) {
			console.log('Update Output Error: ', e);
			return fail(400, {
				form: { ...form, message: 'Error Updating Output (Possibly Duplicate Title / Address)' }
			});
		}
	}
};
