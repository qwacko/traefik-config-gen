<script lang="ts">
import { page } from '$app/stores'
import { Button, Modal, Select, Checkbox, Label, Input } from 'flowbite-svelte'
import type { SourceOutput } from '$lib/trpc/validation/sourcesValidation'
import { trpc } from '$lib/trpc/trpcClient'
import { TRPCClientError } from '@trpc/client'
import { invalidateAll } from '$app/navigation'
import { useDisclosure } from '$lib/stores/useDisclosure'

const popupModal = useDisclosure(false)
let error = ''

export let sourceData: SourceOutput
let internalSourceData = { ...sourceData }
$: if (!$popupModal) {
  internalSourceData = { ...sourceData }
}

const update = async () => {
  try {
    await trpc($page).source.updateSource.mutate(internalSourceData)
    await invalidateAll()
    popupModal.close()
  } catch (err) {
    if (err instanceof TRPCClientError) {
      error = JSON.parse(err.message)
    } else {
      throw err
    }
  }
}
</script>

<Button on:click={() => popupModal.open()}>Edit</Button>
<Modal bind:open={$popupModal} size="xs" autoclose>
  <div class="text-center flex flex-col gap-4">
    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
      Update Source "{internalSourceData.title}""
    </h3>
    <Label class="flex flex-col gap-2">
      <span>Title</span>
      <Input
        bind:value={internalSourceData.title}
        type="text"
        name="title"
        placeholder="Title"
        required />
    </Label>
    <Label class="flex flex-col gap-2">
      <span>Type</span>
      <Select
        bind:value={internalSourceData.type}
        name="type"
        items={[
          { name: 'Docker', value: 'docker' },
          { name: 'Web', value: 'manual' },
          { name: 'YAML File', value: 'yaml' },
          { name: 'Other', value: 'other' },
        ]} />
    </Label>
    <Label class="flex flex-col gap-2">
      <span>Address</span>
      <Input
        bind:value={internalSourceData.address}
        type="text"
        name="address"
        placeholder="Address"
        required />
    </Label>

    <div class="flex flex-row gap-5">
      <Label class="flex flex-col gap-2">
        <span class="flex">Auto Delete</span>
        <Checkbox
          name="autoDelete"
          bind:checked={internalSourceData.autoDelete} />
      </Label>
      <Label class="flex flex-col">
        <span class="flex">Enabled</span>
        <Checkbox name="enabled" bind:checked={internalSourceData.enabled} />
      </Label>
    </div>

    <Button type="button" on:click={update}>Update</Button>
  </div>
</Modal>
