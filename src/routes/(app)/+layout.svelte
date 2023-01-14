<script lang="ts">
import { invalidateAll } from '$app/navigation'
import { page } from '$app/stores'

import { handleSession, signOut } from '@lucia-auth/sveltekit/client'
import {
  Sidebar,
  SidebarGroup,
  SidebarItem,
  SidebarWrapper,
} from 'flowbite-svelte'
import { UserCircle } from 'svelte-heros-v2'

handleSession(page)

const handleSignout = async () => {
  await signOut()
  invalidateAll()
}

$: activeUrl = $page.url.pathname
</script>

<div class="flex flex-row">
  <div class="flex pr-10">
    <Sidebar class="min-h-full">
      <SidebarWrapper class="min-h-screen">
        <SidebarGroup>
          <SidebarItem
            label="Dashboard"
            href="/"
            active="{activeUrl === '/'}" />
          <SidebarItem
            label="Sources"
            href="/sources"
            class="rounded-sm"
            active="{activeUrl.slice(0, '/sources'.length) === '/sources'}" />
          <SidebarItem label="Signout" on:click="{() => handleSignout()}">
            <svelte:fragment slot="icon"
              ><UserCircle
                size="25"
                class="text-red-700 dark:text-green-700" /></svelte:fragment
            ></SidebarItem>
        </SidebarGroup>
      </SidebarWrapper>
    </Sidebar>
  </div>
  <div class="flex flex-1">
    <slot />
  </div>
</div>
