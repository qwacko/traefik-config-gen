<script lang="ts">
	import Row from '$lib/components/Row.svelte';

	export let sources: { id: string }[];
	export let sourceList: { key: string; label: string }[] = [];
	export let emptyMessage: string;
	export let title: string;

	$: sourceTitles = sources.map((item) => {
		const match = sourceList.find((source) => source.key === item.id);
		return match ? match.label : undefined;
	});
</script>

<Row>
	<b>{title} :</b>
	<p>
		{#if sourceTitles.length === 0}
			<i>{emptyMessage}</i>
		{:else}
			{sourceTitles.join(', ')}
		{/if}
	</p>
</Row>
