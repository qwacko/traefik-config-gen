<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import DisplayExample from '$lib/components/DisplayExample.svelte';
	import DisplayHostsList from '$lib/components/DisplayHostsList.svelte';
	import SimpleDataDisplay from '$lib/components/SimpleDataDisplay.svelte';

	export let data;

	$: exampleData = data.template.exampleData ? data.template.exampleData : undefined;
</script>

<Stack gap="0">
	<CenterCard title="Template Configuration" size="xl">
		<Stack>
			<SimpleDataDisplay key="Title" value={data.template.title} />
			<SimpleDataDisplay key="Identifier" value={data.template.identifier} />
			<pre>{data.template.template}</pre>
		</Stack>
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
	<CenterCard size="xl" title="Hosts">
		<DisplayHostsList hosts={data.hosts} />
	</CenterCard>
</Stack>
