import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import 'dotenv/config'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    preprocess({
      postcss: true,
    }),
  ],
  checkOrigin: false,

  kit: {
    adapter: adapter(),
    csrf: { checkOrigin: false },
  },
}

export default config
