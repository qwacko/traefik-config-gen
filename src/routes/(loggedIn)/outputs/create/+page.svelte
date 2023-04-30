<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { CreateOutputSchemaType } from '$lib/schema/outputSchema.js';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, constraints, enhance, message } = superForm<CreateOutputSchemaType>(
		data.form,
		{
			taintedMessage: false
		}
	);
</script>

<form method="post" use:enhance>
	<CenterCard title="Create Output" size="xl">
		<Stack>
			<input type="hidden" name="currentOutput" value="" />
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
			<Checkbox
				title="Auto Update"
				name="autoUpdate"
				label="Auto Update"
				bind:value={$form.autoUpdate}
				errorMessage={$errors.autoUpdate}
				{...$constraints.autoUpdate}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Create Output</button>
				<Space />
				<a href="/outputs" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
