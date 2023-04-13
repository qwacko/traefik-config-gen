<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayOutputHistory from '$lib/components/DisplayOutputHistory.svelte';

	export let data;
</script>

<CenterCard title="Output History (All)" size="xl">
	<DisplayOutputHistory history={data.history} />
</CenterCard>
