import { updateTempateSchema } from '$lib/schema/templateSchema';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { updateExampleFormId, updateFormId } from './formIds';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.templates.get({ id });

	console.log('Found Template', currentData);

	if (!currentData || !currentData.editable) {
		throw redirect(302, '/templates');
	}

	const formValues = {
		id: currentData.id,
		title: currentData.title,
		template: currentData.template,
		exampleData: currentData.exampleData
	};

	const updateExampleForm = await superValidate(formValues, updateTempateSchema, {
		id: updateExampleFormId
	});

	const updateForm = await superValidate(formValues, updateTempateSchema, {
		id: updateFormId
	});

	return {
		template: currentData,
		updateForm,
		updateExampleForm
	};
};

export const actions = {
	update: async (event) => {
		const updateForm = await superValidate(event, updateTempateSchema, { id: updateFormId });

		if (!updateForm.valid) {
			return fail(400, { updateForm });
		}

		console.log('Updating Template', updateForm.data);

		try {
			await event.locals.trpc.templates.update(updateForm.data);
		} catch (e) {
			console.log('Update Template Error', e);
			return fail(400, { updateForm: { ...updateForm, message: 'Error Updating Template' } });
		}
		return { updateForm };
	},
	updateExample: async (event) => {
		const updateExampleForm = await superValidate(event, updateTempateSchema, {
			id: updateExampleFormId
		});

		if (!updateExampleForm.valid) {
			return fail(400, { updateExampleForm });
		}

		console.log('Updating Example', updateExampleForm.data);

		try {
			await event.locals.trpc.templates.update(updateExampleForm.data);
		} catch (e) {
			console.log('Update Template Error', e);
			return fail(400, {
				updateForm: { ...updateExampleForm, message: 'Error Updating Template Example' }
			});
		}
		return { updateExampleForm };
	}

	// addParameter: async (event) => {
	// 	const addParameterForm = await superValidate(event, sourceAddParameterSchema, {
	// 		id: addParameterFormId
	// 	});

	// 	if (!addParameterForm.valid) {
	// 		return fail(400, { addParameterForm });
	// 	}

	// 	try {
	// 		await event.locals.trpc.sources.parameters.addParameter(addParameterForm.data);
	// 	} catch (e) {
	// 		console.log('Add Parameter Error', e);
	// 		return fail(400, {
	// 			addParameterForm: { ...addParameterForm, message: 'Error Adding Parameter' }
	// 		});
	// 	}

	// 	return { addParameterForm };
	// },
	// removeParameter: async (event) => {
	// 	const removeParameterForm = await superValidate(event, sourceRemoveParameterSchema, {
	// 		id: removeParameterFormId
	// 	});

	// 	if (!removeParameterForm.valid) {
	// 		return fail(400, { removeParameterForm });
	// 	}

	// 	try {
	// 		await event.locals.trpc.sources.parameters.removeParameter(removeParameterForm.data);
	// 	} catch (e) {
	// 		console.log('Remove Parameter Error', e);
	// 		return fail(400, {
	// 			removeParameterForm: { ...removeParameterForm, message: 'Error Removing Parameter' }
	// 		});
	// 	}
	// 	return { removeParameterForm };
	// },
	// updateParameter: async (event) => {
	// 	const updateParameterForm = await superValidate(event, sourceUpdateParameterSchema, {
	// 		id: updateParameterFormId
	// 	});

	// 	if (!updateParameterForm.valid) {
	// 		return fail(400, { updateParameterForm });
	// 	}

	// 	try {
	// 		await event.locals.trpc.sources.parameters.updateParameter(updateParameterForm.data);
	// 	} catch (e) {
	// 		console.log('Update Parameter Error', e);
	// 		return fail(400, {
	// 			updateParameterForm: { ...updateParameterForm, message: 'Error Updating Parameter' }
	// 		});
	// 	}
	// 	return { updateParameterForm };
	// }
};
