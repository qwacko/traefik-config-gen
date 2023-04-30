<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data;
</script>

<CenterCard title="Delete Output?"
	>Are you sure you want to delete output <i><b>{data.output.title}</b></i>

	<svelte:fragment slot="footer">
		<Row>
			<form method="post">
				<input type="hidden" name="id" bind:value={data.output.id} />
				<input type="submit" value="Delete" class="btn variant-filled-error" />
			</form>
			<Space />
			<a href="/outputs" class="btn variant-ghost-primary">Cancel</a>
		</Row>
	</svelte:fragment>
</CenterCard>
