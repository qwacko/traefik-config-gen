<script lang="ts">
  import { page } from "$app/stores"
    import SignOutButton from "$lib/components/SignOutButton.svelte"
  
	import { handleSession } from "@lucia-auth/sveltekit/client";

	handleSession(page);
</script>


<SignOutButton />
<slot />

