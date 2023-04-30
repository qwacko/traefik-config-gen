import { superValidate } from 'sveltekit-superforms/server';
import { sourceAddValidation } from '$lib/schema/sourceSchema';
import { fail, redirect } from '@sveltejs/kit';
import type { Source } from '@prisma/client';

export const load = async (event) => {
	const form = await superValidate(event, sourceAddValidation);

	const { routerTemplates, serviceTemplates } = await event.locals.trpc.templates.getAll();

	return {
		form,
		routerTemplates: routerTemplates
			.filter((item) => !item.masterSource)
			.map((item) => ({ key: item.id, label: item.title })),
		serviceTemplates: serviceTemplates
			.filter((item) => !item.masterSource)
			.map((item) => ({ key: item.id, label: item.title }))
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, sourceAddValidation);

		if (!form.valid) {
			return fail(400, { form });
		}

		let newSource: Source | undefined;

		try {
			newSource = await event.locals.trpc.sources.addSource(form.data);
		} catch (e) {
			return fail(400, { form: { ...form, message: 'Error Creating Source' } });
		}
		throw redirect(302, `/sources/${newSource.id}/edit`);
	}
};
