import { TRPCError } from '@trpc/server'
import { t } from './t'
import { authMiddleware } from './middleware/authMiddleware'
import { getDockerInformation } from '$lib/server/docker/getDockerInformation'
import { timeLogMiddleware } from './middleware/timeLogMiddleware'
import { z } from 'zod'

const sourceTypeOptions = ['docker', 'manual', 'yaml', 'other'] as const
const sourceTypeOptionsEditable = [...sourceTypeOptions]

export const router = t.router({
  greeting: t.procedure.query(async () => {
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`
  }),
  greetingProtected: t.procedure.use(authMiddleware).query(async () => {
    return 'Hello Authed User'
  }),
  getDockerInfo: t.procedure.use(authMiddleware).query(async ({ ctx }) => {
    const dockerInfo = await getDockerInformation()
    return true
  }),
  getSources: t.procedure
    .use(authMiddleware)
    .output(
      z.array(
        z.object({
          id: z.string().cuid(),
          title: z.string(),
          type: z
            .string()
            .superRefine((val, ctx) => {
              if (
                !sourceTypeOptions.includes(
                  val as (typeof sourceTypeOptionsEditable)[0]
                )
              ) {
                const options = [...sourceTypeOptions]
                ctx.addIssue({
                  message: `Incorrect Type ${val}`,
                  code: 'invalid_enum_value',
                  path: ctx.path,
                  fatal: true,
                  options,
                  received: val,
                })
              }
            })
            .transform((val) => {
              const data = sourceTypeOptions.reduce((prev, current) => {
                if (val === current) {
                  return current
                }
                return prev
              }, 'docker')
              return data
            }),
          address: z.string(),
          autoDelete: z.boolean(),
          enabled: z.boolean(),
          parameters: z
            .string()
            .transform((data) => JSON.parse(data))
            .optional()
            .nullable(),
          defaultRouterTemplateId: z.string().cuid().optional(),
          defaultServiceTemplateId: z.string().cuid().optional(),
        })
      )
    )
    .query(async ({ ctx }) => {
      const sources = await ctx.db.source.findMany()
      return sources
    }),
  addSource: t.procedure
    .use(authMiddleware)
    .input(
      z.object({
        title: z.string(),
        type: z.enum(sourceTypeOptions),
        address: z.string(),
        autoDelete: z.boolean().optional().default(false),
        enabled: z.boolean().optional().default(true),
        parameters: z.object({}).catchall(z.string()).optional(),
        defaultRouterTemplateId: z.string().cuid().optional(),
        defaultServiceTemplateId: z.string().cuid().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { parameters, ...otherInput } = input
      const parametersText = parameters ? JSON.stringify(parameters) : undefined
      await ctx.db.source.create({
        data: { parameters: parametersText, ...otherInput },
      })
      return true
    }),
})

export type Router = typeof router
