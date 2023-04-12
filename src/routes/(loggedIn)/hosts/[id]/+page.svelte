<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayHostOutput from '$lib/components/DisplayHostOutput.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<Stack>
	<CenterCard title="Host" size="xl">
		<Stack>
			<h4>Configuration</h4>
			<Row>
				<p class="font-bold">Source :</p>
				<a href="/sources/{data.host.source.id}">{data.host.source.title}</a>
			</Row>
			<Row>
				<p class="font-bold">Router Template :</p>
				{#if data.host.router}
					<a href="/templates/{data.host.router.id}">{data.host.router.title}</a>
				{/if}
			</Row>
			<Row>
				<p class="font-bold">Service Template :</p>
				{#if data.host.service}
					<a href="/templates/{data.host.service.id || ''}">{data.host.service.title || ''}</a>
				{/if}
			</Row>
			<h4>Parameters</h4>

			{#if data.host.parameters.length > 0}
				{#each data.host.parameters as currentParameter}
					<Row alignment="bottom">
						<p class="font-bold">{currentParameter.label} :</p>
						<p>{currentParameter.value}</p>
					</Row>
				{/each}
			{:else}
				<p>No Parameters Configured</p>
			{/if}
		</Stack>

		<svelte:fragment slot="footer">
			<Row>
				<a href="/hosts/{data.host.id}/edit" class="btn variant-filled-primary">Edit Host</a>
				<Space />
				<a href="/hosts" class="btn variant-ghost-primary">Return</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
	<DisplayHostOutput host={data.host} />
</Stack>
