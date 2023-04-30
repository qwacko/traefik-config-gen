<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import EditIcon from '$lib/components/Icons/EditIcon.svelte';
	import ErrorText from '$lib/components/ErrorText.svelte';
	import Popover from '$lib/components/Popover.svelte';
	import Row from '$lib/components/Row.svelte';
	import Space from '$lib/components/Space.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import DeleteIcon from '$lib/components/Icons/DeleteIcon.svelte';
	import Center from '$lib/components/Center.svelte';

	export let data;
</script>

<Stack>
	<CenterCard title="Users" size="xl">
		{#if data.users.length === 0}
			<ErrorText message="No users found" />
		{:else}
			<Stack>
				{#each data.users as user}
					<Row>
						<Stack gap="0">
							<h4 class="flex">{user.username}</h4>
							<div class="flex">{user.id}</div>
						</Stack>
						<Space />
						{#if user.id !== data.user.user.userId}
							<Popover message="Delete User" id="delete">
								<a href="/users/delete/{user.id}" class="btn-icon variant-ghost-error">
									<DeleteIcon />
								</a>
							</Popover>
						{/if}
						<Popover message="Update Password" id="update">
							<a href="/users/updatePassword/{user.id}" class="btn-icon variant-ghost-primary">
								<EditIcon />
							</a>
						</Popover>
					</Row>
				{/each}
			</Stack>
		{/if}
	</CenterCard>

	<Center>
		<a href="/users/createUser" class="flex btn variant-filled-primary w-fit">Add User</a>
	</Center>
</Stack>
