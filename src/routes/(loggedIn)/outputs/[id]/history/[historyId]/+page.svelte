<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import DisplayObjectDifferences from '$lib/components/DisplayObjectDifferences.svelte';

	export let data;
</script>

<CenterCard title="Output" size="xl">
	<Stack>
		<Row>
			<p class="font-bold">Title :</p>
			<p>{data.history?.changeTitle}</p>
		</Row>
		<Row>
			<p class="font-bold">Date :</p>
			<p>{data.history?.createdAt.toLocaleString()}</p>
		</Row>
		<p class="font-bold">Differences To Present</p>
		<DisplayObjectDifferences
			previous={JSON.parse(data.history.output)}
			current={JSON.parse(data.latestHistory.output)}
			compact={true}
		/>

		<p class="font-bold">Complete Output</p>
		<pre>{data.history?.output}</pre>
	</Stack>
</CenterCard>
