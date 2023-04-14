<script lang="ts">
	import ActionButtons from './ActionButtons.svelte';
	import Row from './Row.svelte';
	import SimpleDataDisplay from './SimpleDataDisplay.svelte';
	import SourceBadge from './SourceBadge.svelte';
	import Space from './Space.svelte';
	import Stack from './Stack.svelte';

	export let type: 'Router' | 'Service';

	export let templates: {
		title: string;
		id: string;
		masterSource?: { id: string; type: string; title: string } | undefined | null;
		_count: {
			Source: number;
			Host: number;
		};
		editable: boolean;
	}[];
</script>

<Stack>
	{#if templates.length === 0}
		<p>No {type} Templates Found.</p>
	{:else}
		{#each templates as template}
			<Row>
				<Stack gap="0">
					<Row>
						<h5>{template.title}</h5>
						<SourceBadge source={template.masterSource} />
					</Row>
					<Row>
						<SimpleDataDisplay key="Sources" value={template._count.Source} />
						<SimpleDataDisplay key="Hosts" value={template._count.Host} />
					</Row>
				</Stack>
				<Space />
				<ActionButtons
					title={template.title}
					id={template.id}
					urlPrefix="templates"
					hideDelete={template._count.Host > 0 || template._count.Source > 0 || !template.editable}
					hideEdit={!template.editable}
				/>
			</Row>
		{/each}
	{/if}
</Stack>
