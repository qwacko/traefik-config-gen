import { z } from 'zod'

const sourceTypeOptions = ['docker', 'manual', 'yaml', 'other'] as const

export const createSourceValidation = z.object({
  title: z.string(),
  type: z.enum(sourceTypeOptions),
  address: z.string(),
  autoDelete: z
    .string()
    .transform(() => true)
    .or(z.boolean())
    .optional()
    .default(false),
  enabled: z
    .string()
    .transform(() => true)
    .or(z.boolean())
    .optional()
    .default(true),
  defaultRouterTemplateId: z.string().cuid().optional(),
  defaultServiceTemplateId: z.string().cuid().optional(),
})
