import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'

export const load = async (event) => ({
  sources: router.createCaller(await createContext(event)).source.getSources(),
})
