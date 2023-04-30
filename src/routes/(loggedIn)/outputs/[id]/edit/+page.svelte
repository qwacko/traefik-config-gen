<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Select from '$lib/components/Select.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { UpdateOutputSchemaType } from '$lib/schema/outputSchema.js';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, errors, message, constraints, enhance } = superForm<UpdateOutputSchemaType>(
		data.form,
		{
			taintedMessage: null
		}
	);
</script>

<form method="post" use:enhance>
	<input type="hidden" name="id" bind:value={$form.id} />
	<CenterCard title="Edit Output Configuration" size="xl">
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
			<Checkbox
				title="Auto Update"
				name="autoUpdate"
				label="Auto Update"
				bind:value={$form.autoUpdate}
				errorMessage={$errors.autoUpdate}
				{...$constraints.autoUpdate}
			/>
			<Select
				title="Included Sources"
				name="includedSources"
				bind:value={$form.includedSources}
				{...$constraints.includedSources}
				options={data.sources}
				multiple={true}
			/>
			<Select
				title="Excluded Sources"
				name="excludedSources"
				bind:value={$form.excludedSources}
				{...$constraints.excludedSources}
				options={data.sources}
				multiple={true}
			/>
			<Select
				title="Included Hosts"
				name="includedHosts"
				bind:value={$form.includedHosts}
				{...$constraints.includedHosts}
				options={data.hosts}
				multiple={true}
			/>
			<Select
				title="Excluded Hosts"
				name="excludedHosts"
				bind:value={$form.excludedHosts}
				{...$constraints.excludedHosts}
				options={data.hosts}
				multiple={true}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<button type="submit" class="btn variant-filled-primary">Save</button>
		</svelte:fragment>
	</CenterCard>
</form>
