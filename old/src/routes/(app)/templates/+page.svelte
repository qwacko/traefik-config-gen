<script lang="ts">
import { Card, P, Button, Heading, Badge } from 'flowbite-svelte'

export let data
</script>

<div class="flex flex-col items-stretch w-full ">
  {#each data.templates as template}
    <a
      class="my-1 mx-2 min-w-full rounded-md shadow-lg border border-black p-6 hover:bg-gray-100"
      href={`/templates/${template.id}`}>
      <div class="flex flex-row gap-2">
        <Badge class="inline">{template.type}</Badge><P>{template.title}</P>
      </div>
    </a>
  {/each}
</div>
