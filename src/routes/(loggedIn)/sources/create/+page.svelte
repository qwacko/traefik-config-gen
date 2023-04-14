<script lang="ts">
	import Select from '$lib/components/Select.svelte';

	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { sourceTypeDropdown, type sourceAddValidationType } from '$lib/schema/sourceSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data: PageData;

	const { form, errors, constraints, enhance, message } = superForm<sourceAddValidationType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<form method="post" use:enhance>
	<CenterCard title="Create Source" size="xl">
		<Stack>
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
			<Select
				name="type"
				title="Source Type"
				errorMessage={$errors.type}
				options={sourceTypeDropdown}
				bind:value={$form.type}
				{...$constraints.type}
			/>
			<Select
				name="defaultRouterTemplateId"
				title="Default Router Template (Required)"
				errorMessage={$errors.defaultRouterTemplateId}
				options={data.routerTemplates}
				bind:value={$form.defaultRouterTemplateId}
				{...$constraints.defaultRouterTemplateId}
			/>
			<Select
				name="defaultServiceTemplateId"
				title="Default Service Template (Required)"
				errorMessage={$errors.defaultServiceTemplateId}
				options={data.serviceTemplates}
				bind:value={$form.defaultServiceTemplateId}
				{...$constraints.defaultServiceTemplateId}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Create Source</button>
				<Space />
				<a href="/sources" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
