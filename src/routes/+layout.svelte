<script lang="ts">
import { page } from '$app/stores'
import '../app.postcss'

import { handleSession } from '@lucia-auth/sveltekit/client'

handleSession(page)
</script>

<div class="w-full flex justify-center">
  <slot />
</div>
