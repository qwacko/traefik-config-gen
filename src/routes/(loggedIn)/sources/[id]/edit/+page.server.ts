import { idSchema } from '$lib/schema/idSchema';
import {
	sourceAddParameterSchema,
	sourceRemoveParameterSchema,
	sourceUpdateParameterSchema,
	sourceUpdateValidation
} from '$lib/schema/sourceSchema';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import {
	updateFormId,
	addParameterFormId,
	updateParameterFormId,
	removeParameterFormId
} from './formIds';

export const load = async (event) => {
	const parentData = await event.parent();
	const currentData = parentData.source;

	if (!currentData) {
		throw redirect(302, '/sources');
	}

	const updateForm = await superValidate(
		{ ...currentData, address: currentData.address || undefined },
		sourceUpdateValidation,
		{ id: updateFormId }
	);
	const addParameterForm = await superValidate(event, sourceAddParameterSchema, {
		id: addParameterFormId
	});
	const updateParameterForm = await superValidate(event, sourceUpdateParameterSchema, {
		id: updateParameterFormId
	});
	const removeParameterForm = await superValidate(event, sourceRemoveParameterSchema, {
		id: removeParameterFormId
	});

	return {
		updateForm,
		addParameterForm,
		updateParameterForm,
		removeParameterForm
	};
};

export const actions = {
	update: async (event) => {
		const updateForm = await superValidate(event, sourceUpdateValidation, { id: updateFormId });

		if (!updateForm.valid) {
			return fail(400, { updateForm });
		}

		try {
			await event.locals.trpc.sources.updateSource(updateForm.data);
		} catch (e) {
			console.log('Update Source Error', e);
			return fail(400, { updateForm: { ...updateForm, message: 'Error Updating Source' } });
		}
		return { updateForm };
	},

	addParameter: async (event) => {
		const addParameterForm = await superValidate(event, sourceAddParameterSchema, {
			id: addParameterFormId
		});

		if (!addParameterForm.valid) {
			return fail(400, { addParameterForm });
		}

		try {
			await event.locals.trpc.sources.parameters.set(addParameterForm.data);
		} catch (e) {
			console.log('Add Parameter Error', e);
			return fail(400, {
				addParameterForm: { ...addParameterForm, message: 'Error Adding Parameter' }
			});
		}

		return { addParameterForm };
	},
	removeParameter: async (event) => {
		const removeParameterForm = await superValidate(event, sourceRemoveParameterSchema, {
			id: removeParameterFormId
		});

		if (!removeParameterForm.valid) {
			return fail(400, { removeParameterForm });
		}

		try {
			await event.locals.trpc.sources.parameters.remove(removeParameterForm.data);
		} catch (e) {
			console.log('Remove Parameter Error', e);
			return fail(400, {
				removeParameterForm: { ...removeParameterForm, message: 'Error Removing Parameter' }
			});
		}
		return { removeParameterForm };
	},
	updateParameter: async (event) => {
		const updateParameterForm = await superValidate(event, sourceUpdateParameterSchema, {
			id: updateParameterFormId
		});

		if (!updateParameterForm.valid) {
			return fail(400, { updateParameterForm });
		}

		try {
			await event.locals.trpc.sources.parameters.set(updateParameterForm.data);
		} catch (e) {
			console.log('Update Parameter Error', e);
			return fail(400, {
				updateParameterForm: { ...updateParameterForm, message: 'Error Updating Parameter' }
			});
		}
		return { updateParameterForm };
	},
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
