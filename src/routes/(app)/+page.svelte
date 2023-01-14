<script lang="ts">
import { getUser } from '@lucia-auth/sveltekit/client'

import { Alert, Heading } from 'flowbite-svelte'
import { trpc } from '$lib/trpc/trpcClient'

let loading = false

const loadData = async () => {
  console.log('Starting Getting Data')

  loading = true
  const result = await trpc().greeting.query()
  const dockerInfo = await trpc().getDockerInfo.query()
  console.log('Complete')
  loading = false
}

const user = getUser()
</script>

<Heading tag="h1" color="red">Profile</Heading>
<div>
  <p>User id: {$user?.userId}</p>
  <p>Username: {$user?.username}</p>
  <button on:click="{loadData}">Get Data1</button>
  {#if loading}
    <Alert>Loading</Alert>
  {/if}
</div>
