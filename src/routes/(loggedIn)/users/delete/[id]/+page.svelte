<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<CenterCard title="Delete User?">
	<Stack>
		<span class="flex"
			>Are you sure you want to delete user&nbsp; <i><b>{data.user.username}</b></i></span
		>
	</Stack>
	<svelte:fragment slot="footer">
		<Row>
			<form method="post">
				<input type="hidden" name="id" bind:value={data.user.id} />
				<input type="submit" value="Delete" class="btn variant-filled-error" />
			</form>
			<Space />
			<a href="/users" class="btn variant-ghost-primary">Cancel</a>
		</Row>
	</svelte:fragment>
</CenterCard>
