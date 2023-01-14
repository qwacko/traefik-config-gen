<script lang="ts">
import type { PageData } from './$types'
import { Card, P, Button, Heading } from 'flowbite-svelte'

export let data: PageData
</script>

<div class="flex flex-col items-stretch ">
  {#each data.sources as source}
    <Card class="my-1 mx-2 min-w-full hover:bg-gray-100">
      <P>{source.title}</P>
    </Card>
  {/each}
</div>
