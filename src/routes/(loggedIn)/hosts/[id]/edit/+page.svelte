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
	import ParameterSettings from '$lib/components/ParameterSettings.svelte';
	import EditIcon from '$lib/components/Icons/EditIcon.svelte';
	import DisplayHostOutput from '$lib/components/DisplayHostOutput.svelte';

	export let data;

	const {
		form: updateForm,
		enhance: updateFormEnhance,
		errors: updateFormErrors,
		constraints: updateFormConstraints,
		message: updateFormMessage
	} = superForm<hostUpdateValidationType>(data.updateForm);
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
					title="Source"
					errorMessage={$updateFormErrors.sourceId}
					name="sourceId"
					options={data.sources.filter((item) => item.sourceType !== 'YAML')}
					value={$updateForm.sourceId}
					{...$updateFormConstraints.sourceId}
				>
					<svelte:fragment slot="button">
						<a href="/sources/{data.host.sourceId}/edit" class="btn variant-ghost-tertiary">
							<EditIcon />
						</a>
					</svelte:fragment>
				</Select>

				<Select
					title="Router Template"
					errorMessage={$updateFormErrors.routerTemplateId}
					name="routerTemplateId"
					options={data.routerTemplates.filter((item) => item.sourceType !== 'YAML')}
					bind:value={$updateForm.routerTemplateId}
					{...$updateFormConstraints.routerTemplateId}
				>
					<svelte:fragment slot="button">
						<a
							href="/templates/{data.host.routerTemplateId}/edit"
							class="btn variant-ghost-tertiary"
						>
							<EditIcon />
						</a>
					</svelte:fragment>
				</Select>

				<Select
					title="Service Template"
					errorMessage={$updateFormErrors.serviceTemplateId}
					name="serviceTemplateId"
					options={data.serviceTemplates.filter((item) => item.sourceType !== 'YAML')}
					bind:value={$updateForm.serviceTemplateId}
					{...$updateFormConstraints.serviceTemplateId}
				>
					<svelte:fragment slot="button">
						<a
							href="/templates/{data.host.serviceTemplateId}/edit"
							class="btn variant-ghost-tertiary"
						>
							<EditIcon />
						</a>
					</svelte:fragment>
				</Select>
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
				parameters={data.host.parameters}
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

	<DisplayHostOutput host={data.host} />
</Stack>
