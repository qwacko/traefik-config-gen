import type { Router } from '$lib/trpc/router'
import type { TemplateReturnType } from '$lib/trpc/routers/templateRouter'
import { trpc } from '$lib/trpc/trpcClient'
import type { inferRouterInputs } from '@trpc/server'
import { writable, get } from 'svelte/store'

type CreateInputType = inferRouterInputs<Router>['template']['create']

const defaultValue: Omit<CreateInputType, 'id'> = {
  template: '',
  title: '',
  type: 'router',
}

export const useCreateTemplate = ({
  onMutateComplete,
}: {
  onMutateComplete?: (id: string) => void | Promise<void>
} = {}) => {
  const value = writable<Omit<CreateInputType, 'id'>>(defaultValue)

  const mutate = async () => {
    const newTemplate = await trpc().template.create.mutate(get(value))
    onMutateComplete && onMutateComplete(newTemplate.id)
  }

  const reset = () => {
    value.set(defaultValue)
  }

  const actions = { mutate, reset }

  return [value, actions] as [typeof value, typeof actions]
}
