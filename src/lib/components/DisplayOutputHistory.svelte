<script lang="ts">
	import type { OutputHistory } from '@prisma/client';
	import Stack from './Stack.svelte';
	import Row from './Row.svelte';
	import Space from './Space.svelte';
	import EyeIcon from './Icons/EyeIcon.svelte';

	export let history: OutputHistory[] = [];
</script>

<Stack>
	{#each history as historyItem}
		<Row>
			<Stack gap="0">
				<h5 class:font-bold={historyItem.current}>
					{historyItem.changeTitle}
					{#if historyItem.current}(Current){/if}
				</h5>
				<p class:font-bold={historyItem.current}>
					{historyItem.createdAt.toLocaleDateString()}
					{historyItem.createdAt.toLocaleTimeString()}
				</p>
			</Stack>
			<Space />
			<a
				href="/outputs/{historyItem.configId}/history/{historyItem.id}"
				class="btn-icon variant-ghost-secondary"
			>
				<EyeIcon />
			</a>
		</Row>
	{/each}
</Stack>
