<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayHostsList from '$lib/components/DisplayHostsList.svelte';
	import DisplayTemplateList from '$lib/components/DisplayTemplateList.svelte';
	import Row from '$lib/components/Row.svelte';
	import SimpleDataDisplay from '$lib/components/SimpleDataDisplay.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;

	$: defaultRouterTemplate = data.routerTemplates.find(
		(template) => template.key === data.source.defaultRouterTemplateId
	);
	$: defaultServiceTemplate = data.serviceTemplates.find(
		(template) => template.key === data.source.defaultServiceTemplateId
	);
</script>

<Stack gap="0">
	<CenterCard title={data.source.title} size="xl">
		<Stack>
			<SimpleDataDisplay
				key="Default Router Template"
				value={defaultRouterTemplate ? defaultRouterTemplate.label : ''}
			/>
			<SimpleDataDisplay
				key="Default Service Template"
				value={defaultServiceTemplate ? defaultServiceTemplate.label : ''}
			/>
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<a role="button" href="/sources/{data.source.id}/edit" class="btn variant-ghost-primary">
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
	<CenterCard size="xl" title="Router Templates">
		<DisplayTemplateList type="Router" templates={data.routerTemplatesComplete} />
	</CenterCard>
	<CenterCard size="xl" title="Service Templates">
		<DisplayTemplateList type="Service" templates={data.serviceTemplatesComplete} />
	</CenterCard>
</Stack>
