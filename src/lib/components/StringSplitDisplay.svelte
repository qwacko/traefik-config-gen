<script lang="ts">
export let input: string
</script>

<div
  class="flex flex-col gap-1 items-start p-2 border rounded-md bg-gray-100 border-gray-400">
  {#each input.split('\n') as currentSection}
    <code class="flex">{currentSection.replaceAll(' ', '\u00A0')}</code>
  {/each}
</div>
