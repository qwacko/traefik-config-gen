import {
	hostRemoveParameterSchema,
	hostSetParameterSchema,
	hostUpdateValidation
} from '$lib/schema/hostSchema.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

const updateFormId = 'updateForm';
const setParameterFormId = 'setParameterForm';

export const load = async (event) => {
	const id = event.params.id;

	const currentData = await event.locals.trpc.hosts.get({ id });

	if (!currentData) throw redirect(302, `/hosts`);

	const templates = await event.locals.trpc.templates.getAll();

	const sources = event.locals.trpc.sources.getSources();

	const formData = {
		id: currentData.id,
		title: currentData.title,
		identifier: currentData.identifier,
		sourceId: currentData.sourceId,
		routerTemplateId: currentData.routerTemplateId,
		serviceTemplateId: currentData.serviceTemplateId,
		parameters: currentData.parameters
	};

	const updateForm = superValidate(formData, hostUpdateValidation, { id: updateFormId });
	const setParameterForm = superValidate(event, hostSetParameterSchema, {
		id: setParameterFormId
	});

	return { host: currentData, updateForm, templates, setParameterForm, sources };
};

export const actions = {
	update: async (event) => {
		const updateForm = await superValidate(event, hostUpdateValidation, { id: updateFormId });

		if (!updateForm.valid) {
			return fail(400, { updateForm });
		}

		try {
			await event.locals.trpc.hosts.update(updateForm.data);
		} catch (e) {
			console.log('Update Host Error', e);
			return { message: 'Update Host Error' };
		}

		return { updateForm };
	},
	setParameter: async (event) => {
		const setParameterForm = await superValidate(event, hostSetParameterSchema, {
			id: setParameterFormId
		});

		if (!setParameterForm.valid) {
			return fail(400, { setParameterForm });
		}

		try {
			await event.locals.trpc.hosts.parameters.set(setParameterForm.data);
		} catch (e) {
			console.log('Set Host Parameter Error', e);
			return { message: 'Set Host Parameter Error' };
		}

		return { setParameterForm };
	},

	deleteParameter: async (event) => {
		const deleteParameterForm = await superValidate(event, hostRemoveParameterSchema);

		if (!deleteParameterForm.valid) {
			return fail(400, { deleteParameterForm });
		}

		try {
			await event.locals.trpc.hosts.parameters.remove(deleteParameterForm.data);
		} catch (e) {
			console.log('Delete Host Parameter Error', e);
			return { message: 'Delete Host Parameter Error' };
		}
		return {};
	}
};
