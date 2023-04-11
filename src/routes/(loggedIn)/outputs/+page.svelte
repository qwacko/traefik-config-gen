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

<CenterCard size="xl" title="Output Configurations">
	<Stack>
		{#each data.outputs as output}
			<Row>
				<Stack gap="0">
					<h5>{output.title}</h5>
				</Stack>
				<Space />
				<Popover message="View {output.title}" id="view">
					<a href={`/outputs/${output.id}`} class="btn-icon variant-ghost-secondary">
						<InfoIcon />
					</a>
				</Popover>
				<Popover message="Edit {output.title}" id="edit">
					<a href={`/outputs/edit/${output.id}`} class="btn-icon variant-ghost-primary">
						<EditIcon />
					</a>
				</Popover>
				<Popover message="Delete {output.title}" id="delete">
					<a href={`/outputs/delete/${output.id}`} class="btn-icon variant-ghost-error">
						<DeleteIcon />
					</a>
				</Popover>
			</Row>
		{/each}
		<a href="/outputs/create" class="btn variant-filled-primary">Create Output Configuration</a>
	</Stack>
</CenterCard>
