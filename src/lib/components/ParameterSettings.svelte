<script lang="ts">
	import ErrorText from '$lib/components/ErrorText.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import SaveIcon from '$lib/components/Icons/SaveIcon.svelte';
	import Row from '$lib/components/Row.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	export let parameters: Record<string, string> | undefined | null;
	export let id: string | undefined | null;
	export let idKey: string;
	export let setParameterAction: string;
	export let deleteParameterAction: string;
</script>

<Stack>
	{#if parameters && Object.keys(parameters).length > 0}
		{#each Object.keys(parameters) as currentParameterKey}
			<Row alignment="bottom">
				<form method="post" action={setParameterAction}>
					<Row alignment="bottom">
						<input type="hidden" name={idKey} value={id} />
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
							value={parameters[currentParameterKey]}
							errorMessage={null}
						/>
						<button type="submit" class="btn-icon variant-filled-primary"><SaveIcon /></button>
					</Row>
				</form>
				<form method="post" action={deleteParameterAction}>
					<input type="hidden" name={idKey} value={id} />
					<input type="hidden" name="label" value={currentParameterKey} />
					<button type="submit" class="btn-icon variant-filled-error"><DeleteIcon /></button>
				</form>
			</Row>
		{/each}
	{:else}
		<ErrorText message="No Parameters Defined" />
	{/if}
</Stack>
<!-- <Stack>
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
</Stack> -->
