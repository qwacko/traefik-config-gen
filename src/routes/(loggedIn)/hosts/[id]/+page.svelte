<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<Stack>
	<CenterCard title="Host" size="xl">
		<Stack>
			<p>Source: {data.host.source.title}</p>
			<p>Router Template: {data.host.router?.title || ''}</p>
			<p>Service Template: {data.host.service?.title || ''}</p>
		</Stack>

		<svelte:fragment slot="footer">
			<Row>
				<a href="/hosts/edit/{data.host.id}" class="btn variant-filled-primary">Edit Host</a>
				<Space />
				<a href="/hosts" class="btn variant-ghost-primary">Return</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
	<CenterCard title="Raw Host Data" size="xl">
		<pre>{JSON.stringify(data, undefined, 2)}</pre>
	</CenterCard>
</Stack>
