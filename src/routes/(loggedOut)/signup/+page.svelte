<script lang="ts">
	import { enhance } from '$app/forms';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Row from '$lib/components/Row.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { signupSchemaType } from '$lib/schema/signupSchema';
	import Stack from '$lib/components/Stack.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data;
	const { form, errors, constraints, message } = superForm<signupSchemaType>(data.form);
</script>

<form method="POST" use:enhance>
	<CenterCard title="Signup" size="xl">
		<Stack>
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
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Sign Up</button>
				<Space />
				{#if !Boolean(data.firstUser.userCountZero)}
					<a href="/login" class="btn variant-ghost-primary">Login</a>
				{/if}
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
