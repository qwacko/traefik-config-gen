<script lang="ts">
	import { enhance } from '$app/forms';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { signupSchemaType } from '$lib/schema/signupSchema';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data;
	const { form, errors, constraints, message } = superForm<signupSchemaType>(data.form);
</script>

<form method="POST" use:enhance>
	<CenterCard title="Create User Account" size="xl">
		<TextInput
			title="Username"
			errorMessage={$errors.username}
			id="username"
			name="username"
			type="text"
			data-invalid={$errors.username}
			bind:value={$form.username}
			{...$constraints.username}
		/>
		<TextInput
			title="Password"
			errorMessage={$errors.password}
			id="password"
			name="password"
			type="password"
			data-invalid={$errors.password}
			bind:value={$form.password}
			{...$constraints.password}
		/>
		<TextInput
			title="Confirm Password"
			errorMessage={$errors.confirmPassword}
			id="checkPassword"
			name="confirmPassword"
			type="password"
			data-invalid={$errors.confirmPassword}
			bind:value={$form.confirmPassword}
			{...$constraints.confirmPassword}
		/>
		<ErrorText message={$message} />
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Add User</button>
				<Space />
				<a role="button" href="/users" class="btn variant-ghost-primary">Cancel</a>
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
