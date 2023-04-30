<script lang="ts">
	import DisplayDifferences from './DisplayDifferences.svelte';
	import {diffJson} from 'diff';

	export let previous: Record<string, any>;
	export let current: Record<string, any>;
	export let compact: boolean =true;

	$: changes = diffJson(previous, current);
	$: hasDifferences = changes.length > 1 || changes[0].added || changes[0].removed;
</script>

{#if hasDifferences}
	<DisplayDifferences input={changes} {compact} />
{:else}
	<slot>
		<DisplayDifferences input={changes} {compact} />
	</slot>
{/if}
