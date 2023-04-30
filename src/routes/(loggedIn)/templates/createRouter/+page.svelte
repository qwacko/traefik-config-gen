<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import type { createTemplateSchemaType } from '$lib/schema/templateSchema';

	export let data: PageData;

	const { form, errors, constraints, enhance, message } = superForm<createTemplateSchemaType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<form method="post" use:enhance>
	<CenterCard title="Create Router Template" size="xl">
		<Stack>
			<TextInput
				title="Title"
				name="title"
				label="Title"
				bind:value={$form.title}
				errorMessage={$errors.title}
				{...$constraints.title}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Create Router</button>
				<Space />
				<a href="/templates" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
