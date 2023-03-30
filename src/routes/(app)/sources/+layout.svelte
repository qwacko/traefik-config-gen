<script lang="ts">
import { Button, Heading } from 'flowbite-svelte'
import { page } from '$app/stores'

console.log('Base', $page.route.id)
</script>

<div class="flex flex-col w-full mr-10">
  <div class="w-full flex flex-row justify-center">
    <div class="flex">
      <Heading tag="h3" class="py-5 flex">Source</Heading>
    </div>
    <div class="flex">
      {#if $page.route.id && $page.route.id === '/(app)/sources/create'}
        <Button size="sm" class="flex m-4" href="/sources/" color="red"
          >x</Button>
      {:else}
        <Button size="sm" class="flex m-4" href="/sources/create">+</Button>
      {/if}
    </div>
  </div>
  <div class="w-full flex">
    <slot />
  </div>
</div>
