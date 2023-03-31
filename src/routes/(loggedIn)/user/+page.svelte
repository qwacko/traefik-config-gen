<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { trpc } from '$lib/clientTRPC';
	import { page } from '$app/stores';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DataWrapper from '$lib/components/DataWrapper.svelte';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import Button from '$lib/components/Button.svelte';
	import Title from '$lib/components/Title.svelte';

	export let data: PageData;

	const invalidate = () => {
		invalidateAll();
	};
</script>

<CenterCard title="User" maxWidthRem={50}
	><DataWrapper>
		<Title level={1}>User id:</Title>
		<p>{data.user.user.userId}</p>
		<Title level={1}>Username:</Title>
		<p>{data.user.user.username}</p>
	</DataWrapper>

	<DataWrapper>
		<Title level={1}>TRPC Data Sources</Title>
	</DataWrapper>
	<SpreadButtons>
		<form use:enhance method="post" action="?/logout">
			<Button type="submit" style="primary">Sign out</Button>
		</form>
		<Button type="button" style="secondary" on:click={invalidate}>Refresh Data</Button>
	</SpreadButtons>
</CenterCard>
