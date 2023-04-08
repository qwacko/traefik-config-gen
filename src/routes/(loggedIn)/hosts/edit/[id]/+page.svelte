<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { hostUpdateValidationType } from '$lib/schema/hostSchema.js';
	import { superForm } from 'sveltekit-superforms/client';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import { enhance } from '$app/forms';
	import SaveIcon from '$lib/components/Icons/SaveIcon.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import ParameterSettings from '$lib/components/ParameterSettings.svelte';

	export let data;

	const {
		form: updateForm,
		enhance: updateFormEnhance,
		errors: updateFormErrors,
		constraints: updateFormConstraints,
		message: updateFormMessage
	} = superForm<hostUpdateValidationType>(data.updateForm);

	$: parameters = JSON.parse(data.host.parameters || '{}') as Record<string, string>;
</script>

<Stack>
	<form use:updateFormEnhance method="post" action="?/update">
		<input type="hidden" name="id" bind:value={data.host.id} />
		<CenterCard title="Update Host" size="xl">
			<Stack>
				<TextInput
					title="Title"
					name="title"
					label="Title"
					bind:value={$updateForm.title}
					errorMessage={$updateFormErrors.title}
					{...$updateFormConstraints.title}
				/>
				<Select
					title="Router Template"
					errorMessage={$updateFormErrors.routerTemplateId}
					name="routerTemplateId"
					options={data.templates.routerTemplates.map((item) => ({
						key: item.id,
						label: item.title
					}))}
					bind:value={$updateForm.routerTemplateId}
					{...$updateFormConstraints.routerTemplateId}
				/>
				<Select
					title="Service Template"
					errorMessage={$updateFormErrors.serviceTemplateId}
					name="serviceTemplateId"
					options={data.templates.serviceTemplates.map((item) => ({
						key: item.id,
						label: item.title
					}))}
					bind:value={$updateForm.serviceTemplateId}
					{...$updateFormConstraints.serviceTemplateId}
				/>
				<ErrorText message={$updateFormMessage} />
			</Stack>
			<svelte:fragment slot="footer">
				<Row>
					<button type="submit" class="btn variant-filled-primary">Update Host</button>
					<Space />
					<a href="/hosts" class="btn variant-ghost-primary">Cancel</a>
				</Row>
			</svelte:fragment>
		</CenterCard>
	</form>
	<CenterCard title="Parameters" size="xl">
		<Stack>
			<ParameterSettings
				deleteParameterAction="?/deleteParameter"
				parameters={data.host.parametersObject}
				id={data.host.id}
				idKey="hostId"
				setParameterAction="?/setParameter"
			/>
			<form use:enhance action="?/setParameter" method="post">
				<input type="hidden" name="hostId" value={data.host.id} />
				<Row alignment="bottom">
					<TextInput title="Label" name="label" label="Label" />
					<TextInput title="Value" name="value" label="Value" />
					<button type="submit" class="btn variant-filled-primary">Add</button>
				</Row>
			</form>
		</Stack>
	</CenterCard>
</Stack>
