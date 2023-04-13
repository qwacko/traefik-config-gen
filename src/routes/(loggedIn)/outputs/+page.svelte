<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import EditIcon from '$lib/components/Icons/EditIcon.svelte';
	import GenerateIcon from '$lib/components/Icons/GenerateIcon.svelte';
	import HistoryIcon from '$lib/components/Icons/HistoryIcon.svelte';
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
					<Row>
						<p class="font-bold">Address:</p>
						<a href="/{output.address}">/{output.address}</a>
					</Row>
				</Stack>
				<Space />
				<ActionButtons title={output.title} id={output.id} urlPrefix="outputs" />
				<a href="/outputs/{output.id}/generate" class="btn-icon variant-ghost-secondary">
					<GenerateIcon />
				</a>

				<a href="/outputs/{output.id}/history" class="btn-icon variant-ghost-secondary">
					<HistoryIcon />
				</a>
			</Row>
		{/each}
		<a href="/outputs/create" class="btn variant-filled-primary">Create Output Configuration</a>
	</Stack>
</CenterCard>
