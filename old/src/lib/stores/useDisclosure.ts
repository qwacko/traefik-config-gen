import { derived, writable } from 'svelte/store'

export const useDisclosure = (initialValue: boolean) => {
  const value = writable(initialValue)

  return {
    ...value,
    open: () => value.set(true),
    close: () => value.set(false),
    toggle: () => value.update((val) => !val),
  }
}
