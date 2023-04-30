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
	$: sources = $page.route.id?.startsWith('/(loggedIn)/sources');
	$: templates = $page.route.id?.startsWith('/(loggedIn)/templates');
	$: hosts = $page.route.id?.startsWith('/(loggedIn)/hosts');
	$: outputs = $page.route.id?.startsWith('/(loggedIn)/outputs');
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="sidebarLeft">
		<!-- Insert the list: -->
		<nav class="list-nav">
			<ul>
				<li><a href="/" class:variant-soft-primary={homePage}>Home</a></li>
				{#if data.user.user}
					<li><a href="/users" class:variant-soft-primary={users}>Users</a></li>
					<li><a href="/sources" class:variant-soft-primary={sources}>Sources</a></li>
					<li><a href="/templates" class:variant-soft-primary={templates}>Templates</a></li>
					<li><a href="/hosts" class:variant-soft-primary={hosts}>Hosts</a></li>
					<li><a href="/outputs" class:variant-soft-primary={outputs}>Outputs</a></li>
					<li class="pt-4">
						<form action="/?/logout" method="post">
							<button type="submit" class="btn variant-filled-primary w-full">Logout</button>
						</form>
					</li>
				{:else}
					<li class="pt-4"><a href="/login" class="btn variant-filled-primary">Login</a></li>
				{/if}
			</ul>
		</nav>
		<!-- --- -->
	</svelte:fragment>
	<slot />
</AppShell>
