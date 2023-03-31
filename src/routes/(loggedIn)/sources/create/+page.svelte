<script lang="ts">
	import CheckboxInput from './CheckboxInput.svelte';

	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { sourceAddValidationType } from '$lib/schema/sourceSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import SpreadButtons from '$lib/components/SpreadButtons.svelte';
	import Button from '$lib/components/Button.svelte';
	import LinkButton from '$lib/components/LinkButton.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, constraints, enhance } = superForm<sourceAddValidationType>(data.form, {
		taintedMessage: null
	});
</script>

<CenterCard title="Create Source">
	<form method="post" use:enhance>
		<TextInput
			title="Title"
			name="title"
			label="Title"
			bind:value={$form.title}
			errorMessage={$errors.title}
			{...$constraints.title}
		/>
		<TextInput
			title="Address"
			name="address"
			label="Address"
			bind:value={$form.address}
			errorMessage={$errors.address}
			{...$constraints.address}
		/>
		<CheckboxInput bind:checked={$form.enabled} name="enabled" label="Enabled" />
		<SpreadButtons>
			<Button>Create Source</Button>
			<LinkButton style="secondary" href="/sources">Cancel</LinkButton>
		</SpreadButtons>
	</form>
</CenterCard>
