import { fail } from '@sveltejs/kit'
import { auth } from '$lib/server/auth/auth'
import { superValidate, setError } from 'sveltekit-superforms/server'
import { signupSchema } from './signupSchema'

// If the user exists, redirect authenticated users to the profile page.
export const load = async (event) => {
  const form = await superValidate(event, signupSchema)

  return { form }
}

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, signupSchema)
    if (!form.valid) {
      // Again, always return { form } and things will just work.
      return fail(400, { form })
    }

    const { username, password } = form.data

    if (form.data.password !== form.data.confirmPassword) {
      return setError(form, 'confirmPassword', "Passwords don't match")
    }

    try {
      console.log('Starting Create User', { username, password })
      const user = await auth.createUser({
        primaryKey: {
          providerId: 'username',
          providerUserId: username,
          password,
        },
        attributes: {
          username,
        },
      })
      console.log('Created User', user)
      const session = await auth.createSession(user.userId)
      event.locals.setSession(session)
      return { form }
    } catch {
      // username already in use
      return setError(form, 'username', 'Username already in use')
    }
  },
}
