import { validatedActionHandler } from '$lib/server/utils/validatedActionHandler'
import { sourceAddValidation } from '$lib/trpc/validation/sourcesValidation'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  create: validatedActionHandler({
    validator: sourceAddValidation.omit({ parameters: true }),
    requireSession: true,
    processingFunction: async ({ input, trpc }) => {
      console.log('Creating Source', input)
      const data = await trpc.addSource(input)
      if (data) {
        throw redirect(300, `/sources/${data.id}`)
      }

      return fail(400, {
        errors: { formErrors: ['Source Creation Unsuccessful'] },
      })
    },
  }),
} satisfies Actions
