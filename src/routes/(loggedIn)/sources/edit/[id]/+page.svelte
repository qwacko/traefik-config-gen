<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Select from '$lib/components/Select.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { sourceTypeDropdown, type sourceUpdateValidationType } from '$lib/schema/sourceSchema';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, constraints, message, enhance } = superForm<sourceUpdateValidationType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<form method="post" use:enhance>
	<CenterCard title="Edit Source">
		<Stack>
			<input type="hidden" name="id" bind:value={$form.id} />
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
				value={$form.type}
				{...$constraints.type}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<input type="submit" value="Update Source" class="btn variant-filled-primary" />
				<a role="button" href="/sources/delete/{$form.id}" class="btn variant-filled-error"
					>Delete Source</a
				>
				<Space />
				<a role="button" href="/sources" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
