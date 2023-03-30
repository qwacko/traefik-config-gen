<script lang="ts">
import { signOut, getUser } from '@lucia-auth/sveltekit/client'
import { invalidateAll } from '$app/navigation'

const user = getUser()
</script>

{#if $user?.userId}
  <button
    on:click="{async () => {
      await signOut()
      invalidateAll()
    }}">Sign out</button>
{/if}
