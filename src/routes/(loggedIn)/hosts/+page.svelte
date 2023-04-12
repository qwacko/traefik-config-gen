<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayHostsList from '$lib/components/DisplayHostsList.svelte';
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
		<DisplayHostsList hosts={data.hosts} />
		<a href="/hosts/create" class="btn variant-filled-primary">Create Host</a>
	</Stack>
</CenterCard>
