<script lang="ts">
import { Button, Input, Label } from 'flowbite-svelte'
import { useSourceParameters } from './addParameterStore'

export let id: string
export let data: Record<string, string> | null | undefined

//Updates the internal data whenever the external data changes
$: internalData = data

let editing = false
let add = false

$: keys = data ? Object.keys(data) : []

$: ({
  store: newValue,
  reset,
  addMutate,
  updateParameters,
  removeParameter,
} = useSourceParameters({ id }))
</script>

{#if keys.length > 0 && internalData}
  <table class="w-full table-fixed">
    <tr>
      <td class="p-2 text-right font-bold"> Parameter </td>
      <td class="p-2 font-bold"> Value </td>
    </tr>

    {#each keys as currentKey}
      <tr>
        {#if editing}
          <td class="p-2 text-right flex flex-row gap-8">
            <div class="flex grow flex-row justify-end">
              <div class="flex">{currentKey}</div>
            </div>
            <div class="flex">
              <Button
                color="red"
                size="xs"
                on:click={() => removeParameter(currentKey)}>Deletet</Button>
            </div>
          </td>
          <td>
            <Input type="text" bind:value={internalData[currentKey]} />
          </td>
        {:else}
          <td class="p-2 text-right">{currentKey}</td>
          <td class="p-2">{internalData[currentKey]}</td>
        {/if}
      </tr>
    {/each}
  </table>
{:else}
  <div class="w-full text-center">No Parameters Found</div>
{/if}

{#if add}
  <Label class="pt-4 w-full text-center">Add New</Label>
  <div class="columns-2">
    <div class="text-right">
      <Input type="text" class="text-right" bind:value={$newValue.label} />
    </div>
    <div class="text-left">
      <Input type="text" bind:value={$newValue.value} />
    </div>
  </div>
{/if}

<div class="w-full flex flex-row justify-center pt-4 gap-2">
  {#if editing}
    <Button
      color="blue"
      on:click={() => {
        editing = false
        add = false
        internalData = data
      }}>Cancel</Button>
    <Button
      color="blue"
      on:click={async () => {
        await updateParameters(internalData)
        internalData = data

        editing = false
      }}>Save</Button>
  {:else if add}
    <Button
      color="blue"
      on:click={() => {
        editing = false
        add = false
        internalData = data
      }}>Cancel</Button>
    <Button on:click={reset}>Reset</Button>
    <Button
      on:click={async () => {
        await addMutate()
        reset()
        add = false
      }}>Add</Button>
  {:else}
    <Button color="light" on:click={() => (editing = true)}>Edit</Button>
    <Button color="light" on:click={() => (add = true)}>Add</Button>
  {/if}
</div>
