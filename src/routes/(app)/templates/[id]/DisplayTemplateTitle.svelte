<script lang="ts">
import { useTemplateUpdate } from './useTemplateUpdate'
import { Button, Input, P } from 'flowbite-svelte'
import { invalidateAll } from '$app/navigation'
import StringSplitDisplay from '$lib/components/StringSplitDisplay.svelte'
import type { UpdateTemplateTypeWithoutId } from './useTemplateUpdate'

export let id: string
export let title: string

let editing = false

$: console.log('Template Title', title)
$: console.log('ID', id)

$: [currentValue, processedTemplate, changed, actions] = useTemplateUpdate({
  dbValue: { title },
  id,
  onUpdate: async () => {
    await invalidateAll()
    editing = false
  },
})

$: console.log('Current Value', $currentValue)
</script>

<div class="flex flex-row gap-2 items-center">
  {#if editing}
    <Input bind:value={$currentValue.title} />
    <Button
      on:click={() => {
        actions.reset()
        editing = false
      }}>Cancel</Button>
    <Button on:click={actions.update}>Update</Button>
  {:else}
    <P>{title}</P>
    <Button on:click={() => (editing = true)}>Edit</Button>
  {/if}
</div>
