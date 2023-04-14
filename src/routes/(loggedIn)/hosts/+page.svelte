<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayHostsList from '$lib/components/DisplayHostsList.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<CenterCard size="xl" title="Hosts">
	<Stack>
		<DisplayHostsList hosts={data.hosts} />
		<a href="/hosts/create" class="btn variant-filled-primary">Create Host</a>
	</Stack>
</CenterCard>
