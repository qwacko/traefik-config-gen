<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import Stack from '$lib/components/Stack.svelte';

	import { page } from '$app/stores';

	export let data;

	$: view = $page.route.id === '/(loggedIn)/sources/[id]';
	$: edit = $page.route.id === '/(loggedIn)/sources/[id]/edit';
	$: deletePage = $page.route.id === '/(loggedIn)/sources/[id]/delete';
</script>

<Stack alignment="center">
	<h1 class="pt-6 pb-2">{data.source.title}</h1>
	<ActionButtons
		title={data.source.title}
		id={data.source.id}
		urlPrefix="sources"
		viewHighlighted={view}
		editHighlighted={edit}
		deleteHighlighted={deletePage}
		showList={true}
		hidePopups={true}
		hideDelete={data.source._count.Host > 0}
	/>
	<div class="flex p-1" />
	<slot />
</Stack>
