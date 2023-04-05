<script lang="ts">
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { page } from '$app/stores';

	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { AppShell, storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	export let data;

	$: homePage = $page.route.id?.startsWith('/(open)');
	$: users = $page.route.id?.startsWith('/(loggedIn)/users');
	$: user = $page.route.id?.startsWith('/(loggedIn)/user') && !users;
	$: login = $page.route.id?.startsWith('/(loggedOut)');
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="sidebarLeft">
		<!-- Insert the list: -->
		<nav class="list-nav">
			<ul>
				<li><a href="/" class:variant-soft-primary={homePage}>Home</a></li>
				{#if data.user.user}
					<li><a href="/user" class:variant-soft-primary={user}>User</a></li>
					<li><a href="/users" class:variant-soft-primary={users}>Users</a></li>
					<li>
						<form action="/?/logout" method="post">
							<button type="submit" class="btn variant-filled-primary">Logout</button>
						</form>
					</li>
				{:else}
					<li><a href="/login" class="btn variant-filled-primary">Login</a></li>
				{/if}
			</ul>
		</nav>
		<!-- --- -->
	</svelte:fragment>
	<slot />
</AppShell>
