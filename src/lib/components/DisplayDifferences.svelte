<script lang="ts">
	import type { Change } from 'diff';

	export let input: Change[] | undefined;
	export let compact: boolean = true;

	let expanded = compact;

	const unexpand = () => (expanded = false);
	const expand = () => (expanded = true);
</script>

{#if input}
	<pre>
	{#each input as currentChange}
			{#if currentChange.added}
				<ins>{currentChange.value}</ins>
			{:else if currentChange.removed}
				<del>{currentChange.value}</del>
			{:else if expanded}
				<span
					on:click={unexpand}
					on:keydown={unexpand}
					on:keyup={unexpand}
					on:keypress={unexpand}>{currentChange.value}</span>
			{:else}
				<span
					on:click={expand}
					on:keydown={expand}
					on:keyup={expand}
					on:keypress={expand}>...</span>
			{/if}
		{/each}
    </pre>
{/if}
