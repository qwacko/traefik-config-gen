<script lang="ts">
import type { PageData } from './$types'
import { Card, P, Button, Heading } from 'flowbite-svelte'

export let data: PageData
</script>

<div class="flex flex-col items-stretch ">
  {#each data.sources as source}
    <a
      class="my-1 mx-2 min-w-full rounded-md shadow-lg border-2 p-6 hover:bg-gray-100"
      href="{`/sources/${source.id}`}">
      <P>{source.title}</P>
    </a>
  {/each}
</div>
