<script lang="ts">
import {
  AccordionItem,
  Label,
  Input,
  ButtonGroup,
  Button,
  CloseButton,
} from 'flowbite-svelte'
import type { PageData } from './$types'
import DisplayJSON from './DisplayJSON.svelte'

//Params
export let data: PageData['sourceRawData']

//Variables
let autoExpand = 5
let filterTitle: string | undefined
let filterLabelKey: string | undefined
let filterLabelValue: string | undefined

//Reactive Variables
$: dataToUse = data
  ? 'error' in data
    ? undefined
    : data.filter((item) => {
        //Check if filterTitle is Found
        const titles = item.Names.join('___')
        const filterTitleFound = filterTitle
          ? titles.includes(filterTitle)
          : true

        const labelKeys = Object.keys(item.Labels).join('___')
        const filterLabelKeyFound = filterLabelKey
          ? labelKeys.includes(filterLabelKey)
          : true

        const labelValues = Object.values(item.Labels).join('___')

        const filterLabelValueFound = filterLabelValue
          ? labelValues.includes(filterLabelValue)
          : true

        return filterTitleFound && filterLabelKeyFound && filterLabelValueFound
      })
  : undefined
</script>

{#if data}
  <AccordionItem>
    <span slot="header">
      Raw Data
      {#if 'error' in data}
        (Error)
      {/if}
    </span>
    <div class="flex flex-col gap-4">
      <div class="flex flex-row gap-4">
        <div class="flex flex-col gap-2">
          <Label>Filter Title</Label>
          <Input bind:value={filterTitle}>
            <svelte:fragment slot="right">
              {#if filterTitle !== undefined}
                <CloseButton on:click={() => (filterTitle = undefined)} />
              {/if}
            </svelte:fragment>
          </Input>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Docker Label Key</Label>
          <Input bind:value={filterLabelKey}>
            <svelte:fragment slot="right">
              {#if filterLabelKey !== undefined}
                <CloseButton on:click={() => (filterLabelKey = undefined)} />
              {/if}
            </svelte:fragment>
          </Input>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Docker Label Value</Label>
          <Input bind:value={filterLabelValue}>
            <svelte:fragment slot="right">
              {#if filterLabelValue !== undefined}
                <CloseButton on:click={() => (filterLabelValue = undefined)} />
              {/if}
            </svelte:fragment>
          </Input>
        </div>
        <div class="flex flex-col gap-2">
          <Label>Number To Autoexpand</Label>

          <ButtonGroup>
            <Button
              on:click={() => (autoExpand = 0)}
              color={autoExpand === 0 ? 'blue' : 'alternative'}>
              None
            </Button>
            <Button
              on:click={() => (autoExpand = 1)}
              color={autoExpand === 1 ? 'blue' : 'alternative'}>
              1
            </Button>
            <Button
              on:click={() => (autoExpand = 3)}
              color={autoExpand === 3 ? 'blue' : 'alternative'}>
              3
            </Button>
            <Button
              on:click={() => (autoExpand = 5)}
              color={autoExpand === 5 ? 'blue' : 'alternative'}>
              5
            </Button>
            <Button
              on:click={() => (autoExpand = 10)}
              color={autoExpand === 10 ? 'blue' : 'alternative'}>
              10
            </Button>
            <Button
              on:click={() => (autoExpand = 10000)}
              color={autoExpand === 10000 ? 'blue' : 'alternative'}>
              All
            </Button>
          </ButtonGroup>
        </div>
      </div>
      {#if 'error' in data}
        <div>
          {data.error}
        </div>
      {:else}
        <div class="flex flex-col">
          <DisplayJSON sourceData={dataToUse} expandMin={autoExpand} />
        </div>
      {/if}
    </div>
  </AccordionItem>
{/if}
