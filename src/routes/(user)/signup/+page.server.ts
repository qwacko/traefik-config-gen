import { fail, redirect } from '@sveltejs/kit'
import { auth } from '$lib/server/auth/auth'
import type { PageServerLoad, Actions } from './$types'
import { z } from 'zod'
import { validatedActionHandler } from '$lib/server/utils/validatedActionHandler'

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.validate()
  if (session) throw redirect(302, '/')
  return {}
}

const signupValidation = z
  .object({ username: z.string().min(1), password: z.string().min(4) })
  .strip()

export const actions: Actions = {
  default: validatedActionHandler({
    validator: signupValidation,
    processingFunction: async ({ input, requestData }) => {
      try {
        const user = await auth.createUser('username', input.username, {
          password: input.password,
          attributes: {
            username: input.username,
          },
        })
        const session = await auth.createSession(user.userId)
        requestData.locals.setSession(session)
      } catch {
        // username already in use
        return fail(400, {
          errors: { fieldErrors: { username: 'Username Already In Use' } },
        })
      }
      return { success: true }
    },
  }),

  // async ({ request, locals }) => {
  // 	const form = await request.formData();
  // 	const username = form.get("username");
  // 	const password = form.get("password");

  // 	// check for empty values
  // 	if (!username || !password || typeof username !== "string" || typeof password !== "string") {
  // 		return fail(400);
  // 	}

  // }
}
