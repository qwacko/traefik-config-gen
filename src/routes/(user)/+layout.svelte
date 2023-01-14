<script lang="ts">
import { page } from '$app/stores'

import { handleSession } from '@lucia-auth/sveltekit/client'

handleSession(page)
</script>

<div class="w-full flex justify-center">
  <slot />
</div>
