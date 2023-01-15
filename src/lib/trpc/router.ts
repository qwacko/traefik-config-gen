import { t } from './t'
import { authMiddleware } from './middleware/authMiddleware'
import { getDockerInformation } from '$lib/server/docker/getDockerInformation'
import {
  sourceAddValidation,
  sourceGetOutputValidation,
  sourceUpdateValidation,
} from './validation/sourcesValidation'
import { z } from 'zod'
import { TRPCError } from '@trpc/server'

export const router = t.router({
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
  }),
  greetingProtected: t.procedure.use(authMiddleware).query(async () => {
    return 'Hello Authed User'
  }),
  getDockerInfo: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
    const dockerInfo = await getDockerInformation({})
    return true
  }),
  getSources: t.procedure
    .use(authMiddleware)
    .output(sourceGetOutputValidation)
    .query(async ({ ctx }) => ctx.db.source.findMany()),
  addSource: t.procedure
    .use(authMiddleware)
    .input(sourceAddValidation)
    .mutation(async ({ input: data, ctx }) => ctx.db.source.create({ data })),
  updateSource: t.procedure
    .use(authMiddleware)
    .input(sourceUpdateValidation)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.db.source.update({ where: { id }, data })
    }),
  getSourceRawData: t.procedure
    .use(authMiddleware)
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const source = await ctx.db.source.findUniqueOrThrow({
        where: { id: input.id },
      })

      const sourceType = source.type
      const sourceAddress = source.address

      if (sourceType === 'docker') {
        try {
          const returnData = await getDockerInformation({
            socketPath: sourceAddress,
          })
          return returnData
        } catch (e) {
          console.log(e)
          throw new TRPCError({
            message: 'Error Getting Data From Socket',
            code: 'BAD_REQUEST',
          })
        }
      }
    }),
})

export type Router = typeof router
export type RouterCaller = ReturnType<Router['createCaller']>
