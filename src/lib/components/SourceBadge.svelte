<script lang="ts">
	import Row from './Row.svelte';

	export let source: { id: string; type: string; title: string } | undefined | null;
</script>

{#if source}
	{#if source.type === 'YAML'}
		<Row>
			<a href="/sources/{source.id}" class="badge variant-ghost-tertiary">
				YAML - {source.title}
			</a>
		</Row>
	{/if}
{/if}
