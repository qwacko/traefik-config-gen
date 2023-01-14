<script lang="ts">
import { page } from '$app/stores'
import type { PageData } from './$types'
import { Alert } from 'flowbite-svelte'

export let data: PageData
$: id = $page.params.id

$: sourceData =
  data.sources && id ? data.sources.find((item) => item.id === id) : undefined

$: console.log('Sources', data.sources)
$: console.log('id', id)
</script>

{#if sourceData}
  {sourceData.title}
{:else}
  <Alert>Item Not Found</Alert>
{/if}
