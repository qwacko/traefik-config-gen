<script lang="ts">
import type { PageData } from './$types'
import { Card, P, Button, Heading, Badge } from 'flowbite-svelte'

export let data: PageData
</script>

<div class="flex flex-col items-stretch w-full ">
  {#each data.sources as source}
    <a
      class="my-1 mx-2 min-w-full rounded-md shadow-lg border border-black p-6 hover:bg-gray-100"
      href="{`/sources/${source.id}`}">
      <div class="flex flex-row gap-2">
        <Badge class="inline">{source.type}</Badge><P>{source.title}</P>
      </div>
    </a>
  {/each}
</div>
