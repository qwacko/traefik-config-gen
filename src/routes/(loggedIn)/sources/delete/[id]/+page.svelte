<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data;
</script>

<CenterCard title="Delete Source?"
	>Are you sure you want to delete source <i><b>{data.source.title}</b></i>

	<svelte:fragment slot="footer">
		<Row>
			<form method="post">
				<input type="hidden" name="id" bind:value={data.source.id} />
				<input type="submit" value="Delete" class="btn variant-filled-error" />
			</form>
			<Space />
			<a href="/sources" class="btn variant-ghost-primary">Cancel</a>
		</Row>
	</svelte:fragment>
</CenterCard>
