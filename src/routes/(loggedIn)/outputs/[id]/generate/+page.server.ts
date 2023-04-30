import { updateOutputCurrentSchema } from '$lib/schema/outputSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import { diffJson } from 'diff';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
	const parentData = await event.parent();
	const output = parentData.output;

	if (!output) throw redirect(302, '/outputs');

	const generatedOutput = await event.locals.trpc.outputs.generateOutput({ id: output.id });
	const generatedOutputString = JSON.stringify(generatedOutput, undefined, 2);
	const latest = await event.locals.trpc.outputs.getOutput({ outputId: output.id });

	// const differences =
	// 	latest && generatedOutput
	// 		? diff.diffLines(latest.output, generatedOutputString, {
	// 				newlineIsToken: true,
	// 				ignoreWhitespace: true
	// 		  })
	// 		: [];

	const differences =
		latest && generatedOutput ? diffJson(JSON.parse(latest.output), generatedOutput) : [];

	const updateForm = superValidate(
		{
			outputId: output.id,
			outputText: generatedOutputString,
			changeTitle: `Update Generated`
		},
		updateOutputCurrentSchema
	);

	return { generatedOutput, latest, differences, updateForm };
};

export const actions = {
	update: async (event) => {
		const updateForm = await superValidate(event, updateOutputCurrentSchema);

		if (!updateForm.valid) {
			return fail(400, { updateForm });
		}

		try {
			await event.locals.trpc.outputs.updateCurrent({
				changeTitle: updateForm.data.changeTitle,
				outputId: updateForm.data.outputId,
				outputText: updateForm.data.outputText
			});

			return { updateForm };
		} catch (e) {
			console.log('Update Output Current Error', e);
			return fail(400, { updateForm: { ...updateForm, message: 'Error Updating Output' } });
		}
	}
};
