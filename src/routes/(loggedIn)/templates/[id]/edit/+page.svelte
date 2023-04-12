<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import TextAreaInput from '$lib/components/TextAreaInput.svelte';
	import type { updateTemplateSchemaType } from '$lib/schema/templateSchema.js';
	import { superForm } from 'sveltekit-superforms/client';
	import DisplayExample from '$lib/components/DisplayExample.svelte';

	export let data;

	const {
		form: updateForm,
		errors: updateFormErrors,
		constraints: updateFormConstraints,
		message: updateFormMessage,
		enhance: updateFormEnhance
	} = superForm<updateTemplateSchemaType>(data.updateForm, {
		taintedMessage: null
	});

	const {
		form: updateExampleForm,
		errors: updateExampleFormErrors,
		constraints: updateExampleFormConstraints,
		message: updateExampleFormMessage,
		enhance: updateExampleFormEnhance
	} = superForm<updateTemplateSchemaType>(data.updateExampleForm, {
		taintedMessage: null
	});
</script>

<form method="post" use:updateFormEnhance action="?/update">
	<Stack gap="0" alignment="center">
		<CenterCard
			title="Edit {data.template.type === 'router' ? 'Router' : 'Service'} Template"
			size="xl"
		>
			<Stack>
				<input type="hidden" name="id" bind:value={$updateForm.id} />
				<TextInput
					title="Title"
					name="title"
					label="Title"
					bind:value={$updateForm.title}
					errorMessage={$updateFormErrors.title}
					{...$updateFormConstraints.title}
				/>
				<TextAreaInput
					title="Template"
					name="template"
					label="Template"
					height="xl"
					bind:value={$updateForm.template}
					errorMessage={$updateFormErrors.template}
					{...$updateFormConstraints.template}
				/>
				<ErrorText message={$updateFormMessage} />
			</Stack>
			<svelte:fragment slot="footer">
				<Row>
					<input type="submit" value="Update Template" class="btn variant-filled-primary" />
					{#if data.template._count.Host === 0 && data.template._count.Source === 0}
						<a
							role="button"
							href="/templates/delete/{$updateForm.id}"
							class="btn variant-filled-error"
						>
							Delete Template
						</a>
					{/if}
					<Space />
					<a role="button" href="/templates" class="btn variant-ghost-primary">Return</a>
				</Row>
			</svelte:fragment>
		</CenterCard>

		<CenterCard size="xl" title="Processed Example">
			<input type="hidden" name="id" bind:value={$updateExampleForm.id} />
			<Stack>
				<TextAreaInput
					title="Example Data"
					name="exampleData"
					label="Example Data"
					height="md"
					bind:value={$updateForm.exampleData}
					errorMessage={$updateFormErrors.exampleData}
					{...$updateFormConstraints.exampleData}
				/>
				<ErrorText message={$updateFormMessage} />

				<input type="submit" value="Update Example" class="btn variant-filled-primary" />

				<DisplayExample template={$updateForm.template} exampleData={$updateForm.exampleData} />
			</Stack>
		</CenterCard>
	</Stack>
</form>
