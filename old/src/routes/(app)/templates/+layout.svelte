<script lang="ts">
import { Button, Heading } from 'flowbite-svelte'
import { trpc } from '$lib/trpc/trpcClient'
import { goto, invalidateAll } from '$app/navigation'
</script>

<div class="flex flex-col w-full mr-10">
  <div class="w-full flex flex-row justify-center">
    <div class="flex">
      <Heading tag="h3" class="py-5 flex">Templates</Heading>
    </div>
    <div class="flex">
      <Button
        on:click={() => goto('/templates/create')}
        size="sm"
        class="flex m-4">+</Button>
    </div>
  </div>
  <div class="w-full flex ">
    <slot />
  </div>
</div>
