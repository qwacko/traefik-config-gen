import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import { redirect } from '@sveltejs/kit'
import { validatedActionHandler } from '$lib/server/utils/validatedActionHandler'
import { sourceUpdateValidation } from '$lib/trpc/validation/sourcesValidation'

export const load = async (event) => {
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
}

export const actions = {
  update: validatedActionHandler({
    validator: sourceUpdateValidation,
    requireSession: true,
    processingFunction: async ({ input, trpc }) =>
      trpc.source.updateSource(input),
  }),
}
