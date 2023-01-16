import { auth } from './lib/server/auth/auth'
import { handleHooks } from '@lucia-auth/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle } from '@sveltejs/kit'
import { createTRPCHandle } from 'trpc-sveltekit'
import { router } from '$lib/trpc/router'
import { createContext } from '$lib/trpc/context'

export const handle = sequence(
  handleHooks(auth),
  createTRPCHandle({ router, createContext })
)
