<script lang="ts">
	import Center from '$lib/components/Center.svelte';
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

<Stack alignment="center">
	<CenterCard title="Sources" size="xl">
		<Stack>
			{#each data.sources as source}
				<Row>
					{source.title}
					<Space />
					<Popover message="View {source.title}" id="view">
						<a href={`/sources/${source.id}`} class="btn-icon variant-ghost-secondary">
							<InfoIcon />
						</a>
					</Popover>
					<Popover message="Edit {source.title}" id="edit">
						<a href={`/sources/edit/${source.id}`} class="btn-icon variant-ghost-primary">
							<EditIcon />
						</a>
					</Popover>
					<Popover message="Delete {source.title}" id="delete">
						<a href={`/sources/delete/${source.id}`} class="btn-icon variant-ghost-error">
							<DeleteIcon />
						</a>
					</Popover>
				</Row>
			{/each}
		</Stack>
	</CenterCard>
	<Center>
		<a href="/sources/create" class="btn variant-filled-primary">New Source</a>
	</Center>
</Stack>
