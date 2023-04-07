<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import DisplayExample from '../edit/[id]/DisplayExample.svelte';
	import { updateExampleFormId } from '../edit/[id]/formIds';

	export let data;

	$: exampleData = data.template.exampleData ? data.template.exampleData : undefined;
</script>

<Stack gap="0">
	<CenterCard title={data.template.title} size="xl">
		<Stack
			>Data Goes Here
			<h4>Template</h4>
			<pre>{data.template.template}</pre>
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<a
					role="button"
					href="/templates/edit/{data.template.id}"
					class="btn variant-ghost-primary"
				>
					Edit
				</a>
				<Space />
				<a role="button" href="/templates/" class="btn variant-ghost-primary"> Return </a>
			</Row>
		</svelte:fragment>
	</CenterCard>
	<CenterCard title="Example" size="xl">
		<Stack>
			<h4>Example Data</h4>
			{#if exampleData}
				<pre>{JSON.stringify(JSON.parse(exampleData || ''), undefined, 2)}</pre>
			{:else}
				<p>No Example Data Present</p>
			{/if}
			<h4>Example Output</h4>
			<DisplayExample template={data.template.template} exampleData={data.template.exampleData} />
		</Stack>
	</CenterCard>
</Stack>
