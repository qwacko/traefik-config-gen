import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import type { ServiceTemplate } from '@prisma/client';
import { createTemplateSchema } from '$lib/schema/templateSchema.js';

export const load = async (event) => {
	const form = await superValidate(event, createTemplateSchema);

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, createTemplateSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		let newSource: ServiceTemplate | undefined;

		try {
			newSource = await event.locals.trpc.templates.createService(form.data);
		} catch {
			return fail(400, { form: { ...form, message: 'Error Creating Router Template' } });
		}
		throw redirect(302, `/templates/edit/${newSource.id}`);
	}
};
