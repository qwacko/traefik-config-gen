<script lang="ts">
import { page } from '$app/stores'
import { Alert, Button } from 'flowbite-svelte'
import { Badge } from 'flowbite-svelte'
import DisplayTemplate from './DisplayTemplate.svelte'
import DisplayTemplateTitle from './DisplayTemplateTitle.svelte'
import StringSplitDisplay from '$lib/components/StringSplitDisplay.svelte'
import { goto } from '$app/navigation'

export let data
$: id = $page.params.id

$: templateData =
  data.templates && id
    ? data.templates.find((item) => item.id === id)
    : undefined
$: currentIndex =
  data.templates && id
    ? data.templates.findIndex((item) => item.id === id)
    : undefined
$: nextId =
  data.templates &&
  currentIndex !== undefined &&
  currentIndex < data.templates.length - 1
    ? data.templates[currentIndex + 1].id
    : undefined
$: prevId =
  data.templates && currentIndex !== undefined && currentIndex > 0
    ? data.templates[currentIndex - 1].id
    : undefined
</script>

{#if templateData}
  <div class="flex w-full flex-col gap-4">
    <div
      class="w-full rounded-md shadow-xl outline outline-1 outline-black p-4 flex flex-col items-center gap-2">
      <div class="flex text-xl flex-row gap-4 items-center">
        <div class="flex flex-row gap-4 items-center">
          <Button on:click={() => goto(`/templates`)}>Return To List</Button>
          {#if prevId}
            <Button on:click={() => goto(`/templates/${prevId}`)}>Prev</Button>
          {/if}
          <DisplayTemplateTitle
            id={templateData.id}
            title={templateData.title} />
          {#if nextId}
            <Button on:click={() => goto(`/templates/${nextId}`)}>Next</Button>
          {/if}
        </div>
      </div>
      <Badge>{templateData.type}</Badge>
      <div class="flex">
        <StringSplitDisplay input={templateData.template} />
      </div>
    </div>
    <div
      class="w-full rounded-md shadow-xl outline outline-1 outline-black p-4 flex flex-col items-center gap-2">
      <DisplayTemplate
        id={templateData.id}
        data={{
          exampleData: templateData.exampleData || undefined,
          template: templateData.template,
        }} />
    </div>
  </div>
{:else}
  <Alert>Item Not Found</Alert>
{/if}
