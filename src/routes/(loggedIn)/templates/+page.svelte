<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import EditIcon from '$lib/components/Icons/EditIcon.svelte';
	import InfoIcon from '$lib/components/Icons/InfoIcon.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<Stack alignment="center" gap="0">
	<CenterCard title="Router Templates" size="xl">
		<Stack>
			{#if data.routerTemplates.length === 0}
				<p>No Router Templates Found.</p>
			{:else}
				{#each data.routerTemplates as template}
					<Row>
						<Stack gap="0">
							<h5>{template.title}</h5>
							<Row>
								<p class="font-bold">Sources :</p>
								<p>{template._count.Source}</p>
								<p class="font-bold">Hosts:</p>
								<p>{template._count.Host}</p>
							</Row>
						</Stack>
						<Space />
						<ActionButtons
							title={template.title}
							id={template.id}
							urlPrefix="templates"
							hideDelete={template._count.Host > 0 || template._count.Source > 0}
						/>
					</Row>
				{/each}
			{/if}
			<a href="/templates/createRouter" class="btn variant-filled-primary">New Router Template</a>
		</Stack>
	</CenterCard>
	<CenterCard title="Service Templates" size="xl">
		<Stack>
			{#if data.serviceTemplates.length === 0}
				<p>No Service Templates Found.</p>
			{:else}
				{#each data.serviceTemplates as template}
					<Row>
						<Stack gap="0">
							<h5>{template.title}</h5>
							<Row>
								<p class="font-bold">Sources :</p>
								<p>{template._count.Source}</p>
								<p class="font-bold">Hosts:</p>
								<p>{template._count.Host}</p>
							</Row>
						</Stack>
						<Space />
						<ActionButtons
							title={template.title}
							id={template.id}
							urlPrefix="templates"
							hideEdit={!template.editable}
							hideDelete={template._count.Host > 0 || template._count.Source > 0}
						/>
					</Row>
				{/each}
			{/if}
			<a href="/templates/createService" class="btn variant-filled-primary">New Service Template</a>
		</Stack>
	</CenterCard>
</Stack>
