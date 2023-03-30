<script lang="ts">
import { useTemplateUpdate } from './useTemplateUpdate'
import { Button } from 'flowbite-svelte'
import { invalidateAll } from '$app/navigation'
import StringSplitDisplay from '$lib/components/StringSplitDisplay.svelte'
import type { UpdateTemplateTypeWithoutId } from './useTemplateUpdate'

export let id: string
export let data: UpdateTemplateTypeWithoutId

$: [currentValue, processedTemplate, changed, actions] = useTemplateUpdate({
  dbValue: data,
  id,
  onUpdate: async () => {
    await invalidateAll()
  },
})
</script>

<div class="flex flex-col gap-4 w-full">
  <p class="flex font-bold">Template Configuration</p>
  <textarea
    bind:value={$currentValue.template}
    class="rounded-md w-full flex" />
  <p class="flex font-bold">Sample Data</p>
  <textarea
    bind:value={$currentValue.exampleData}
    class="rounded-md w-full flex" />

  <p class="flex font-bold pt-2">Example Result</p>
  <div class="flex flex-col">
    <StringSplitDisplay input={$processedTemplate} />
  </div>
  <div class="flex flex-row gap-4">
    <Button color="blue" disabled={!$changed} on:click={actions.update}
      >Update Template</Button>
    <Button color="light" on:click={actions.reset}>Reset</Button>
  </div>
</div>
