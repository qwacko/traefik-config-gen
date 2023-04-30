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
	import type { hostAddValidationType } from '$lib/schema/hostSchema';
	import Select from '$lib/components/Select.svelte';

	export let data: PageData;

	const { form, errors, constraints, enhance, message } = superForm<hostAddValidationType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<form method="post" use:enhance>
	<CenterCard title="Create Host" size="xl">
		<Stack>
			<TextInput
				title="Title"
				name="title"
				label="Title"
				bind:value={$form.title}
				errorMessage={$errors.title}
				{...$constraints.title}
			/>
			<Select
				title="Source"
				errorMessage={$errors.sourceId}
				name="sourceId"
				options={data.sources
					.filter((item) => item.type !== 'YAML')
					.map((item) => ({ key: item.id, label: item.title }))}
				value={$form.sourceId}
				{...$constraints.sourceId}
			/>
			<Select
				title="Router Template"
				errorMessage={$errors.routerTemplateId}
				name="routerTemplateId"
				options={data.templates.routerTemplates
					.filter((item) => (item.masterSource ? item.masterSource.type !== 'YAML' : true))
					.map((item) => ({
						key: item.id,
						label: item.title
					}))}
				value={$form.routerTemplateId}
				{...$constraints.routerTemplateId}
			/>
			<Select
				title="Service Template"
				errorMessage={$errors.serviceTemplateId}
				name="serviceTemplateId"
				options={data.templates.serviceTemplates
					.filter((item) => (item.masterSource ? item.masterSource.type !== 'YAML' : true))
					.map((item) => ({
						key: item.id,
						label: item.title
					}))}
				value={$form.serviceTemplateId}
				{...$constraints.serviceTemplateId}
			/>

			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Create Host</button>
				<Space />
				<a href="/templates" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
