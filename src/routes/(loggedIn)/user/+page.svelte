<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data: PageData;

	const invalidate = () => {
		invalidateAll();
	};
</script>

<CenterCard title="User" size="xl">
	<Stack>
		<h2>User id:</h2>
		<p>{data.user.user.userId}</p>
		<h3>Username:</h3>
		<p>{data.user.user.username}</p>
	</Stack>

	<Stack>
		<h2>TRPC Data Sources</h2>
	</Stack>
	<Row>
		<form use:enhance method="post" action="?/logout">
			<button type="submit" class="btn variant-filled-primary">Sign out</button>
		</form>
		<Space />
		<button type="button" on:click={invalidate} class="btn variant-ghost-secondary"
			>Refresh Data</button
		>
	</Row>
</CenterCard>
