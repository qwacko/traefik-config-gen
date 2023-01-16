import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import type { LayoutServerLoad } from './$types'

export const load = (async (event) => ({
  sources: router.createCaller(await createContext(event)).source.getSources(),
})) satisfies LayoutServerLoad
