<script lang="ts">
	import { page } from '$app/stores';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import type { updatePasswordSchemaType } from '$lib/schema/updatePasswordSchema';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;
	const { form, enhance, errors, constraints } = superForm<updatePasswordSchemaType>(data.form, {
		taintedMessage: null
	});
</script>

<form use:enhance method="POST">
	<CenterCard title="Update Password for {data.user.user.username}">
		<input type="hidden" name="id" bind:value={$page.params.id} />
		<Stack>
			<TextInput
				title="Password"
				name="password"
				label="Password"
				type="password"
				bind:value={$form.password}
				errorMessage={$errors.password}
				{...$constraints.password}
			/>
			<TextInput
				title="Confirm Password"
				name="confirmPassword"
				label="Confirm Password"
				type="password"
				bind:value={$form.confirmPassword}
				errorMessage={$errors.confirmPassword}
				{...$constraints.confirmPassword}
			/>
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Update Password</button>
				<Space />
				<a role="button" href="/users" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
