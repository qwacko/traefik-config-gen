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

<CenterCard size="xl" title="Hosts">
	<Stack>
		{#each data.hosts as host}
			<Row>
				<Stack gap="0">
					<h5>{host.title}</h5>
					{#each host.parameters as parameter}
						<Row>
							<p class="font-bold">{parameter.label} :</p>
							<p>{parameter.value}</p>
						</Row>
					{/each}
				</Stack>
				<Space />
				<Popover message="View {host.title}" id="view">
					<a href={`/hosts/${host.id}`} class="btn-icon variant-ghost-secondary">
						<InfoIcon />
					</a>
				</Popover>
				<Popover message="Edit {host.title}" id="edit">
					<a href={`/hosts/edit/${host.id}`} class="btn-icon variant-ghost-primary">
						<EditIcon />
					</a>
				</Popover>
				<Popover message="Delete {host.title}" id="delete">
					<a href={`/hosts/delete/${host.id}`} class="btn-icon variant-ghost-error">
						<DeleteIcon />
					</a>
				</Popover>
			</Row>
		{/each}
		<a href="/hosts/create" class="btn variant-filled-primary">Create Host</a>
	</Stack>
</CenterCard>
