<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
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
					<Stack gap="0">
						<h5>{source.title}</h5>
						<Row>
							<p class="font-bold">Type:</p>
							<p>{source.type}</p>
							<p class="font-bold">Hosts:</p>
							<p>{source._count.Host}</p>
						</Row>
					</Stack>
					<Space />
					<ActionButtons
						title={source.title}
						id={source.id}
						urlPrefix="sources"
						hideDelete={source._count.Host > 0}
					/>
				</Row>
			{/each}
		</Stack>
	</CenterCard>
	<Center>
		<a href="/sources/create" class="btn variant-filled-primary">New Source</a>
	</Center>
</Stack>
