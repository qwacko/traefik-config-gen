import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './loginSchema';
import { prisma } from '$lib/server/db';

// If the user exists, redirect authenticated users to the profile page.
export const load = async (event) => {
	const form = await superValidate(event, loginSchema);
	const userCount = await prisma.authUser.count();

	if (userCount === 0) {
		throw redirect(302, '/firstSignup');
	}

	return { form };
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const key = await auth.useKey('username', form.data.username, form.data.password);
			const session = await auth.createSession(key.userId);
			event.locals.auth.setSession(session);
			return { form };
		} catch {
			return fail(400, { form: { ...form, message: 'Login Error' } });
		}
	}
};
