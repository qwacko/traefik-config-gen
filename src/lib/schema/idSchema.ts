import { z } from 'zod';

export const idSchema = z.object({ id: z.string().cuid() });
export type IdSchemaType = typeof idSchema;
