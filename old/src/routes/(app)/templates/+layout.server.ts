import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import type { LayoutServerLoad } from './$types'

export const load = async (event) => {
  console.log('Load Function Layout')
  const templates = await router
    .createCaller(await createContext(event))
    .template.get()
  console.log('Load Function Complete')

  return {
    templates,
  }
}
