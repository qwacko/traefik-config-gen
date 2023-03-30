<script lang="ts">
import { Button, Modal } from 'flowbite-svelte'
import { writable } from 'svelte/store'
import type { SourceOutput } from '$lib/trpc/validation/sourcesValidation'

export let data: SourceOutput

const useDisclosure = (initialData: boolean) => {
  const value = writable(initialData)

  const set = (newValue: boolean) => value.set(newValue)
  const open = () => value.set(true)
  const close = () => value.set(false)
  const toggle = () => value.update((val) => !val)

  return [value, { set, open, close, toggle }] as const
}

const [modalOpen, { open, close }] = useDisclosure(false)
</script>

<Button on:click={open}>Del</Button>
<Modal title="Delete {data.title}?" bind:open={$modalOpen} autoclose>
  <div class="flex flex-row justify-between">
    <Button on:click={close} outline>Cancel</Button>
    <Button on:click={() => console.log('Deleting')}>Delete</Button>
  </div>
</Modal>
