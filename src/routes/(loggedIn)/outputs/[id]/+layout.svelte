<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import Stack from '$lib/components/Stack.svelte';

	import { page } from '$app/stores';
	import Popover from '$lib/components/Popover.svelte';
	import GenerateIcon from '$lib/components/Icons/GenerateIcon.svelte';
	import Row from '$lib/components/Row.svelte';
	import HistoryIcon from '$lib/components/Icons/HistoryIcon.svelte';

	export let data;

	$: view = $page.route.id === '/(loggedIn)/outputs/[id]';
	$: edit = $page.route.id === '/(loggedIn)/outputs/[id]/edit';
	$: deletePage = $page.route.id === '/(loggedIn)/outputs/[id]/delete';
	$: generatePage = $page.route.id === '/(loggedIn)/outputs/[id]/generate';
	$: historyPage = $page.route.id === '/(loggedIn)/outputs/[id]/history';
</script>

<Stack alignment="center">
	<h1 class="pt-6 pb-2">{data.output.title}</h1>
	<Row>
		<ActionButtons
			title={data.output.title}
			id={data.output.id}
			urlPrefix="outputs"
			viewHighlighted={view}
			editHighlighted={edit}
			deleteHighlighted={deletePage}
			showList={true}
			hidePopups={true}
		/>
		<a
			href="/outputs/{data.output.id}/generate"
			class="btn-icon {generatePage ? 'variant-filled-primary' : 'variant-ghost-secondary'}"
		>
			<GenerateIcon />
		</a>

		<a
			href="/outputs/{data.output.id}/history"
			class="btn-icon {historyPage ? 'variant-filled-primary' : 'variant-ghost-secondary'}"
		>
			<HistoryIcon />
		</a>
	</Row>
	<div class="flex p-1" />
	<slot />
</Stack>
