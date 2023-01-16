import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { validatedActionHandler } from '$lib/server/utils/validatedActionHandler'
import {
  sourceAddValidation,
  sourceUpdateValidation,
} from '$lib/trpc/validation/sourcesValidation'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const load = (async (event) => {
  const session = await event.locals.validate()
  if (!session) throw redirect(302, '/login')

  const sourceId = event.params.id

  try {
    const rawQueryData = await router
      .createCaller(await createContext(event))
      .source.getSourceRawData({ id: sourceId })

    return { sourceRawData: rawQueryData }
  } catch (e) {
    return {
      sourceRawData: {
        error: 'Error Getting Data From Source. Possibly incorrect address?',
      },
    }
  }
}) satisfies PageServerLoad

export const actions = {
  update: validatedActionHandler({
    validator: sourceUpdateValidation,
    requireSession: true,
    processingFunction: async ({ input, trpc }) =>
      trpc.source.updateSource(input),
  }),
} satisfies Actions
