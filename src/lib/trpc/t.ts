import type { Context } from './context'
import { initTRPC } from '@trpc/server'

// import { authMiddleware } from './middleware/authMiddleware'
export const t = initTRPC.context<Context>().create()
