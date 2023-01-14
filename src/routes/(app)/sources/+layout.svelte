<script lang="ts">
import { Button, Heading } from 'flowbite-svelte'
import { trpc } from '$lib/trpc/trpcClient'
import { invalidateAll } from '$app/navigation'

const createSource = async () => {
  await trpc().addSource.mutate({
    address: '/var/run/docker.sock',
    title: 'Local Docker',
    type: 'docker',
  })

  invalidateAll()
}
</script>

<div class="flex flex-col w-full mr-10">
  <div class="w-full flex flex-row justify-center">
    <div class="flex">
      <Heading tag="h3" class="py-5 flex">Source</Heading>
    </div>
    <div class="flex">
      <Button on:click="{createSource}" size="sm" class="flex m-4">+</Button>
    </div>
  </div>
  <slot />
</div>
