import { derived, writable, get } from 'svelte/store'
import { trpc } from '$lib/trpc/trpcClient'
import { invalidateAll } from '$app/navigation'

type DataType = {
  value: string
  label: string
}

export const useSourceParameters = ({ id }: { id: string }) => {
  const value = writable<{
    value: string
    label: string
  }>({ value: '', label: '' })
  const loading = writable<boolean>(false)

  const reset = () => value.set({ value: '', label: '' })
  const addMutate = async () => {
    const rawValue = get(value)
    await mutateValue(rawValue)
  }
  const mutateValue = async (newValue: DataType) => {
    if (newValue && newValue.label.length > 0 && newValue.value.length > 0) {
      loading.set(true)
      await trpc().source.parameters.addParameter.mutate({
        id,
        label: newValue.label,
        value: newValue.value,
      })

      await invalidateAll()
      loading.set(false)
    }
  }

  const updateParameters = async (
    newValue: Record<string, string> | undefined | null
  ) => {
    if (newValue) {
      loading.set(true)
      await trpc().source.parameters.updateParameters.mutate({
        id,
        data: newValue,
      })
      await invalidateAll()
      loading.set(false)
    }
  }

  const removeParameter = async (label: string) => {
    loading.set(true)
    await trpc().source.parameters.removeParameter.mutate({ id, label })
    await invalidateAll()
    loading.set(false)
  }

  return {
    store: value,
    loading,
    reset,
    addMutate,
    mutateValue,
    updateParameters,
    removeParameter,
  }
}
