<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayOutputHistory from '$lib/components/DisplayOutputHistory.svelte';
	import Row from '$lib/components/Row.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import DisplaySources from '../DisplaySources.svelte';

	export let data;
</script>

<CenterCard title="Output Config" size="xl">
	<Stack>
		<Row>
			<b>Title :</b>
			<p>{data.output.title}</p>
		</Row>

		<Row>
			<b>Address :</b>
			<p>{data.output.address}</p>
		</Row>

		<Row>
			<b>Auto Update :</b>
			<p>{data.output.autoUpdate}</p>
		</Row>
		<DisplaySources
			title="Included Sources"
			sources={data.output.includedSources}
			sourceList={data.sources}
			emptyMessage="All"
		/>
		<DisplaySources
			title="Excluded Sources"
			sources={data.output.excludedSources}
			sourceList={data.sources}
			emptyMessage="None"
		/>
		<DisplaySources
			title="Included Hosts"
			sources={data.output.includedHosts}
			sourceList={data.hosts}
			emptyMessage="All"
		/>
		<DisplaySources
			title="Excluded Hosts"
			sources={data.output.excludedHosts}
			sourceList={data.hosts}
			emptyMessage="None"
		/>
	</Stack>
</CenterCard>
<CenterCard title="History (10 Latest)" size="xl">
	<DisplayOutputHistory history={data.output.outputHistory} />
</CenterCard>
