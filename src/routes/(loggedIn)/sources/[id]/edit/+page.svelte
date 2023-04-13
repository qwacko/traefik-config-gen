<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Select from '$lib/components/Select.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import {
		type sourceAddParameterSchemaType,
		sourceTypeDropdown,
		type sourceUpdateValidationType
	} from '$lib/schema/sourceSchema';
	import { superForm } from 'sveltekit-superforms/client';
	import ParameterSettings from '$lib/components/ParameterSettings.svelte';

	export let data;

	const {
		form: updateForm,
		errors: updateFormErrors,
		constraints: updateFormConstraints,
		message: updateFormMessage,
		enhance: updateFormEnhance
	} = superForm<sourceUpdateValidationType>(data.updateForm, {
		taintedMessage: null
	});

	const {
		form: addParameterForm,
		errors: addParameterFormErrors,
		constraints: addParameterFormConstraints,
		message: addParameterFormMessage,
		enhance: addParameterFormEnhance
	} = superForm<sourceAddParameterSchemaType>(data.addParameterForm, {
		taintedMessage: null
	});
</script>

<Stack gap="0" alignment="center">
	<form method="post" use:updateFormEnhance action="?/update">
		<CenterCard title="Edit Source" size="xl">
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
				<TextInput
					title="Address"
					name="address"
					label="Address"
					bind:value={$updateForm.address}
					errorMessage={$updateFormErrors.address}
					{...$updateFormConstraints.address}
				/>
				<Select
					name="type"
					title="Source Type"
					errorMessage={$updateFormErrors.type}
					options={sourceTypeDropdown.map((item) => ({ key: item.label, label: item.label }))}
					value={$updateForm.type}
					{...$updateFormConstraints.type}
				/>
				<ErrorText message={$updateFormMessage} />
			</Stack>
			<svelte:fragment slot="footer">
				<Row>
					<input type="submit" value="Update Source" class="btn variant-filled-primary" />
					{#if data.source._count.Host === 0}
						<a
							role="button"
							href="/sources/{$updateForm.id}/delete"
							class="btn variant-filled-error"
						>
							Delete Source
						</a>
					{/if}

					<Space />
				</Row>
			</svelte:fragment>
		</CenterCard>
	</form>
	<CenterCard title="Parameters" size="xl">
		<ParameterSettings
			deleteParameterAction="?/removeParameter"
			setParameterAction="?/updateParameter"
			id={data.source.id}
			idKey="sourceId"
			parameters={data.source.parameters}
		/>
		<Stack>
			<form method="post" action="?/addParameter" use:addParameterFormEnhance>
				<Row alignment="bottom">
					<input type="hidden" name="sourceId" value={data.source.id} />
					<TextInput
						title="Label"
						name="label"
						label="Label"
						bind:value={$addParameterForm.label}
						errorMessage={$addParameterFormErrors.label}
						{...$addParameterFormConstraints.label}
					/>
					<TextInput
						title="Value"
						name="value"
						label="Value"
						bind:value={$addParameterForm.value}
						errorMessage={$addParameterFormErrors.value}
						{...$addParameterFormConstraints.value}
					/>
					<button type="submit" class="btn variant-filled-primary">Add Parameter</button>
				</Row>
			</form>
			{#if $addParameterFormMessage}<ErrorText message={$addParameterFormMessage} />{/if}
		</Stack>
	</CenterCard>
	{#if data.source.type === 'YAML'}
		<CenterCard title="YAML" size="xl">
			<form method="post" action="?/refresh">
				<input type="hidden" name="id" bind:value={$updateForm.id} />
				<input type="submit" value="Refresh" class="btn variant-ghost-primary" />
			</form>
		</CenterCard>
	{/if}
</Stack>
