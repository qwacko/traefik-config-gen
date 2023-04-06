<script lang="ts">
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
						{template.title}
						<Space />
						<Popover message="View {template.title}" id="view">
							<a href={`/templates/${template.id}`} class="btn-icon variant-ghost-secondary">
								<InfoIcon />
							</a>
						</Popover>
						<Popover message="Edit {template.title}" id="edit">
							<a href={`/templates/edit/${template.id}`} class="btn-icon variant-ghost-primary">
								<EditIcon />
							</a>
						</Popover>
						<Popover message="Delete {template.title}" id="delete">
							<a href={`/templates/delete/${template.id}`} class="btn-icon variant-ghost-error">
								<DeleteIcon />
							</a>
						</Popover>
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
						{template.title}
						<Space />
						<Popover message="View {template.title}" id="view">
							<a href={`/templates/${template.id}`} class="btn-icon variant-ghost-secondary">
								<InfoIcon />
							</a>
						</Popover>
						<Popover message="Edit {template.title}" id="edit">
							<a href={`/templates/edit/${template.id}`} class="btn-icon variant-ghost-primary">
								<EditIcon />
							</a>
						</Popover>
						<Popover message="Delete {template.title}" id="delete">
							<a href={`/templates/delete/${template.id}`} class="btn-icon variant-ghost-error">
								<DeleteIcon />
							</a>
						</Popover>
					</Row>
				{/each}
			{/if}
			<a href="/templates/createService" class="btn variant-filled-primary">New Service Template</a>
		</Stack>
	</CenterCard>
</Stack>
