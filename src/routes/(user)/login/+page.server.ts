import { fail, redirect } from '@sveltejs/kit'
import { auth } from '$lib/server/auth/auth'
import type { PageServerLoad, Actions } from './$types'
import { z } from 'zod'
import type { KeyEvents } from 'svelte-heros-v2/Key.svelte'
import type { Validate } from '@lucia-auth/sveltekit'
import { validatedActionHandler } from '../../../lib/server/utils/validatedActionHandler'

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.validate()
  if (session) throw redirect(302, '/')
}

const loginValidation = z
  .object({ username: z.string().min(1), password: z.string().min(4) })
  .strip()

export const actions = {
  default: validatedActionHandler({
    validator: loginValidation,
    processingFunction: async ({ requestData, input }) => {
      try {
        const user = await auth.authenticateUser(
          'username',
          input.username,
          input.password
        )
        const session = await auth.createSession(user.userId)
        requestData.locals.setSession(session)
      } catch {
        // invalid credentials
        return fail(400, {
          errors: { errors: ['Username or password not found'] },
        })
      }
      return { success: true }
    },
  }),
  //  async ({ request, locals }) => {
  // const validatedForm = await validateForm({
  //   validator: loginValidation,
  //   request,
  // })

  // if (validatedForm.error) {
  //   return fail(400, validatedForm.error)
  //   const failReturn = fail(400, { ...validatedForm.error })
  //   type FailReturnType = typeof failReturn
  //   return failReturn
  // }

  // try {
  //   const user = await auth.authenticateUser(
  //     'username',
  //     validatedForm.data.data.username,
  //     validatedForm.data.data.password
  //   )
  //   const session = await auth.createSession(user.userId)
  //   locals.setSession(session)
  // } catch {
  //   // invalid credentials
  //   return fail(400, {
  //     errors: {
  //       formErrors: ['Incorrect username or password'],
  //     },
  //   })
  // }
  // return { success: true }
} satisfies Actions

export type LoginActionType = typeof actions
