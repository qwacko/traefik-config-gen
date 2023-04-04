<script lang="ts">
	import { enhance } from '$app/forms';
	import CenterCard from '$lib/components/CenterCard.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { loginSchemaType } from '$lib/schema/loginSchema';
	import Stack from '$lib/components/Stack.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';

	export let data;
	const { form, errors, constraints, message } = superForm<loginSchemaType>(data.form);
</script>

<form method="POST" use:enhance>
	<CenterCard title="Login" size="xl">
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
				type="password"
				id="password"
				name="password"
				data-invalid={$errors.password}
				bind:value={$form.password}
				{...$constraints.password}
			/>
			<ErrorText message={$message} />
		</Stack>
		<svelte:fragment slot="footer">
			<Row>
				<button type="submit" class="btn variant-filled-primary">Sign In</button>
				<Space />
				{#if data.firstUser.allowSignup}
					<a href="/signup" class="btn variant-ghost-primary">Sign Up</a>
				{/if}
			</Row>
		</svelte:fragment>
	</CenterCard>
</form>
