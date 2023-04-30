<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayDifferences from '$lib/components/DisplayDifferences.svelte';
	import DisplayObjectDifferences from '$lib/components/DisplayObjectDifferences.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { UpdateOutputCurrentSchemaType } from '$lib/schema/outputSchema.js';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, message, errors, constraints, enhance } = superForm<UpdateOutputCurrentSchemaType>(
		data.updateForm,
		{
			taintedMessage: false
		}
	);
</script>

<CenterCard
	title="Differences {data.differences.length === 1 ? '( None )' : '( Present )'}"
	size="xl"
>
	{#if 'message' in data.generatedOutput}
		<ErrorText message={data.generatedOutput.message} />
	{:else if data.latest}
		<DisplayObjectDifferences
			previous={JSON.parse(data.latest.output)}
			current={data.generatedOutput}
			compact={true}
		>
			<p>No Differences</p>
		</DisplayObjectDifferences>
	{/if}
	<svelte:fragment slot="footer">
		{#if !('message' in data.generatedOutput)}
			<form method="post" action="?/update" use:enhance>
				<Stack>
					<Row alignment="bottom">
						<input type="hidden" name="outputId" value={data.output.id} />
						<input
							type="hidden"
							name="outputText"
							value={JSON.stringify(data.generatedOutput, undefined, 2)}
						/>
						<TextInput
							label="Change Title"
							name="changeTitle"
							title="Change Title"
							bind:value={$form.changeTitle}
							errorMessage={$errors.changeTitle}
							{...$constraints.changeTitle}
						/>
						<Space />
						<button type="submit" class="btn variant-filled-primary">Update</button>
					</Row>
					<ErrorText message={$message} />
				</Stack>
			</form>
		{/if}
	</svelte:fragment>
</CenterCard>

<CenterCard title="Current Generated Output" size="xl">
	<pre>{JSON.stringify(data.generatedOutput, undefined, 2)}</pre>
</CenterCard>
<CenterCard title="Latest Output" size="xl">
	{#if data.latest}
		<pre>{data.latest.output}</pre>
	{:else}
		<p>No previous output</p>
	{/if}
</CenterCard>
