<script lang="ts">
import { page } from '$app/stores'
import type { PageData } from './$types'
import { Alert } from 'flowbite-svelte'
import { Card, Badge, Accordion, AccordionItem } from 'flowbite-svelte'
import dayjs from 'dayjs'
import EditModal from './EditModal.svelte'

export let data: PageData
$: id = $page.params.id

$: sourceData =
  data.sources && id ? data.sources.find((item) => item.id === id) : undefined

const dateNow = new Date()
$: lastUpdateTime = sourceData?.lastUpdated
  ? dayjs(sourceData.lastUpdated).format('YYYY/MM/DD h:mm A')
  : undefined
$: dateDiff = sourceData?.lastUpdated
  ? dayjs(dateNow).diff(sourceData.lastUpdated, 'hours')
  : undefined
</script>

{#if sourceData}
  <div class="flex w-full flex-col gap-4">
    <div
      class="w-full rounded-md shadow-xl outline outline-1 outline-black p-4 flex flex-col items-center gap-2">
      <div class="flex text-xl flex-row gap-4 items-center">
        <div class="flex"><b>{sourceData.title}</b></div>
        <div class="flex">
          <EditModal sourceData="{sourceData}" />
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <Badge>{sourceData.type}</Badge>
        <div class="flex">{sourceData.address}</div>
      </div>
      <div class="flex font-light italic">
        {#if lastUpdateTime}
          Last Updated ${lastUpdateTime}
        {:else}
          Never Updated
        {/if}
      </div>
      <div class="flex flex-row gap-2">
        <Badge color="dark"
          >{#if sourceData.enabled}Enabled{:else}Disabled{/if}</Badge
        ><Badge color="dark"
          >{#if sourceData.autoDelete}Auto Delete{:else}Dont Auto Delete{/if}</Badge>
      </div>
    </div>
    <Accordion class="w-full rounded-md ">
      {#if data.sourceRawData}
        <AccordionItem>
          <span slot="header"
            >Raw Data {#if 'error' in data.sourceRawData}(Error){/if}</span>
          {#if 'error' in data.sourceRawData}
            <div>
              {data.sourceRawData.error}
            </div>
          {:else}
            <div>
              {JSON.stringify(data.sourceRawData)}
            </div>
          {/if}
        </AccordionItem>
      {/if}
    </Accordion>
  </div>
{:else}
  <Alert>Item Not Found</Alert>
{/if}
