<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import SaveIcon from '$lib/components/Icons/SaveIcon.svelte';
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
	import { updateFormId } from './formIds';

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

	$: console.log('Page Data : ', data);
	$: console.log('Form Value', $updateForm);

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
					options={sourceTypeDropdown}
					value={$updateForm.type}
					{...$updateFormConstraints.type}
				/>
				<ErrorText message={$updateFormMessage} />
			</Stack>
			<svelte:fragment slot="footer">
				<Row>
					<input type="submit" value="Update Source" class="btn variant-filled-primary" />
					<a role="button" href="/sources/delete/{$updateForm.id}" class="btn variant-filled-error"
						>Delete Source</a
					>
					<Space />
					<a role="button" href="/sources" class="btn variant-ghost-primary">Return</a>
				</Row>
			</svelte:fragment>
		</CenterCard>
	</form>
	<CenterCard title="Parameters" size="xl"
		><Stack>
			{#if data.source.parameters && Object.keys(data.source.parameters).length > 0}
				{#each Object.keys(data.source.parameters) as currentParameterKey}
					<Row alignment="bottom">
						<form method="post" action="?/updateParameter">
							<Row alignment="bottom">
								<input type="hidden" name="sourceId" value={data.source.id} />
								<input type="hidden" name="label" value={currentParameterKey} />
								<TextInput
									title="Label"
									name="label2"
									label="Label"
									value={currentParameterKey}
									errorMessage={null}
									disabled={true}
								/>
								<TextInput
									title="Value"
									name="value"
									label="Value"
									value={data.source.parameters[currentParameterKey]}
									errorMessage={null}
								/>
								<button type="submit" class="btn-icon variant-filled-primary"><SaveIcon /></button>
							</Row>
						</form>
						<form method="post" action="?/removeParameter">
							<input type="hidden" name="sourceId" value={data.source.id} />
							<input type="hidden" name="label" value={currentParameterKey} />
							<button type="submit" class="btn-icon variant-filled-error"><DeleteIcon /></button>
						</form>
					</Row>
				{/each}
			{:else}
				<ErrorText message="No Parameters Defined" />
			{/if}
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
</Stack>
