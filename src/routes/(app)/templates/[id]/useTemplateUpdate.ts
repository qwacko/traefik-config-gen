import { derived, writable, get } from 'svelte/store'
import Handlebars from 'handlebars'
import { trpc } from '$lib/trpc/trpcClient'
import type { inferRouterInputs } from '@trpc/server'
import type { Router } from '$lib/trpc/router'
import { isEqual } from 'lodash-es'

export type UpdateTemplateType = inferRouterInputs<Router>['template']['update']
export type UpdateTemplateTypeWithoutId = Omit<UpdateTemplateType, 'id'>

export const useTemplateUpdate = ({
  dbValue,
  id,
  onUpdate,
}: {
  dbValue: UpdateTemplateTypeWithoutId
  id: string
  onUpdate?: () => void | Promise<void>
}) => {
  const currentValue = writable({ ...dbValue })
  const processedTemplate = derived(currentValue, (val) => {
    const processed = Handlebars.compile(val.template)
    try {
      const result = processed(JSON.parse(val.exampleData || '{}'))
      return result
    } catch (e) {
      return 'Template Error'
    }
  })
  const changed = derived(currentValue, (val) => {
    return !isEqual(dbValue, val)
  })

  const update = async () => {
    await trpc().template.update.mutate({
      id,
      ...get(currentValue),
    })
    onUpdate && onUpdate()
  }

  const reset = () => {
    currentValue.set(dbValue)
  }

  return [currentValue, processedTemplate, changed, { update, reset }] as const
}
