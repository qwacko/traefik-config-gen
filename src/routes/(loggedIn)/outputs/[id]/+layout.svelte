<script lang="ts">
	import ActionButtons from '$lib/components/ActionButtons.svelte';
	import Stack from '$lib/components/Stack.svelte';

	import { page } from '$app/stores';
	import Popover from '$lib/components/Popover.svelte';
	import GenerateIcon from '$lib/components/Icons/GenerateIcon.svelte';
	import Row from '$lib/components/Row.svelte';

	export let data;

	$: view = $page.route.id === '/(loggedIn)/outputs/[id]';
	$: edit = $page.route.id === '/(loggedIn)/outputs/[id]/edit';
	$: deletePage = $page.route.id === '/(loggedIn)/outputs/[id]/delete';
	$: generatePage = $page.route.id === '/(loggedIn)/outputs/[id]/generate';
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
		<Popover message={undefined} id="generate">
			<a
				href="/outputs/{data.output.id}/generate"
				class="btn-icon {generatePage ? 'variant-filled-primary' : 'variant-ghost-secondary'}"
			>
				<GenerateIcon />
			</a>
		</Popover>
	</Row>
	<div class="flex p-1" />
	<slot />
</Stack>
