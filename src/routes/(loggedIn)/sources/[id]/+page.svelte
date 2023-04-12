<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayHostsList from '$lib/components/DisplayHostsList.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<Stack gap="0">
	<CenterCard title={data.source.title} size="xl">
		<Stack>Data Goes Here</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<a role="button" href="/sources/edit/{data.source.id}" class="btn variant-ghost-primary">
					Edit
				</a>
				<Space />
				<a role="button" href="/sources/" class="btn variant-ghost-primary">Return</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
	<CenterCard title="Parameters" size="xl">
		<Stack alignment="center">
			{#if data.source.parameters && Object.keys(data.source.parameters).length > 0}
				{#each data.source.parameters as currentParameter}
					<Row alignment="bottom">
						<p>{currentParameter.label}</p>
						<p>{currentParameter.value}</p>
					</Row>
				{/each}
			{:else}
				<p>No Parameters Defined</p>
			{/if}
		</Stack>
	</CenterCard>
	<CenterCard size="xl" title="Hosts">
		<DisplayHostsList hosts={data.hosts} />
	</CenterCard>
</Stack>
