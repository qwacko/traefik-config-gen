<script lang="ts">
	import type { Change } from 'diff';

	export let input: Change[] | undefined;
	export let compact: boolean = true;

	let expanded = compact;
</script>

{#if input}
	<pre>
	{#each input as currentChange}
			{#if currentChange.added}
				<ins>{currentChange.value}</ins>
			{:else if currentChange.removed}
				<del>{currentChange.value}</del>
			{:else if expanded}
				<span on:click={() => (expanded = false)}>{currentChange.value}</span>
			{:else}
				<span on:click={() => (expanded = true)}>...</span>
			{/if}
		{/each}
    </pre>
{/if}
