import { t } from '../t'
import { TRPCError } from '@trpc/server'

export const authMiddleware = t.middleware(async ({ next, ctx }) => {
  // console.log('TRPC Middleware Context', ctx)
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next()
})
