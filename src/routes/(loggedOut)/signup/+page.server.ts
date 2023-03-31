import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { signupSchema } from '$lib/schema/signupSchema';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

// If the user exists, redirect authenticated users to the profile page.
export const load = (async (event) => {
	const form = await superValidate(event, signupSchema);

	const firstUser = await event.locals.trpc.users.firstUser();
	if (!firstUser.userCountZero && !firstUser.allowSignup) {
		throw redirect(302, '/login');
	}

	return { form, firstUser };
}) satisfies PageServerLoad;

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, signupSchema);

		const result = await event.locals.trpc.users.createFirstUser(form.data);

		if (result.error) {
			return setError(form, result.error.location, result.error.message);
		}

		return { form };
	}
};
