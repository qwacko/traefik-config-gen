import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import type { Host } from '@prisma/client';
import { hostAddValidation } from '$lib/schema/hostSchema.js';

export const load = async (event) => {
	const form = superValidate(event, hostAddValidation);
	const templates = event.locals.trpc.templates.getAll();
	const sources = event.locals.trpc.sources.getSources();

	return { form, templates, sources };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, hostAddValidation);

		if (!form.valid) {
			return fail(400, { form });
		}

		let newSource: Host | undefined;

		try {
			newSource = await event.locals.trpc.hosts.add(form.data);
		} catch {
			return fail(400, { form: { ...form, message: 'Error Creating Host' } });
		}
		if (newSource) {
			throw redirect(302, `/hosts/${newSource.id}/edit`);
		}
		return { form };
	}
};
