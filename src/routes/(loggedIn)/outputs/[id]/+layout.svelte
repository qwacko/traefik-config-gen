<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import Row from '$lib/components/Row.svelte';
	import Stack from '$lib/components/Stack.svelte';

	import { page } from '$app/stores';

	export let data;

	$: view = $page.route.id === '/(loggedIn)/outputs/[id]';
	$: edit = $page.route.id === '/(loggedIn)/outputs/[id]/edit';
	$: deletePage = $page.route.id === '/(loggedIn)/outputs/[id]/delete';
</script>

<Stack alignment="center">
	<h1 class="pt-6 pb-2">{data.output.title}</h1>
	<ActionButtons
		title={data.output.title}
		id={data.output.id}
		urlPrefix="outputs"
		viewHighlighted={view}
		editHighlighted={edit}
		deleteHighlighted={deletePage}
		hidePopups={true}
	/>
	<div class="flex p-1" />
	<slot />
</Stack>
