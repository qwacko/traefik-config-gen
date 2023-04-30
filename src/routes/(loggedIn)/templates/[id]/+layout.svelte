<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import Row from '$lib/components/Row.svelte';
	import Stack from '$lib/components/Stack.svelte';

	import { page } from '$app/stores';

	export let data;

	$: view = $page.route.id === '/(loggedIn)/templates/[id]';
	$: edit = $page.route.id === '/(loggedIn)/templates/[id]/edit';
	$: deletePage = $page.route.id === '/(loggedIn)/templates/[id]/delete';
</script>

<Stack alignment="center">
	<h1 class="pt-6 pb-2">{data.template.title}</h1>
	<ActionButtons
		title={data.template.title}
		id={data.template.id}
		urlPrefix="templates"
		viewHighlighted={view}
		editHighlighted={edit}
		deleteHighlighted={deletePage}
		showList={true}
		hidePopups={true}
		hideDelete={data.template._count.Host > 0 ||
			data.template._count.Source > 0 ||
			!data.template.editable}
		hideEdit={!data.template.editable}
	/>
	<div class="flex p-1" />
	<slot />
</Stack>
