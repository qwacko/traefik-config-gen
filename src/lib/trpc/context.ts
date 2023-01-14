import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import { db } from '../server/db/db'

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
  const session = await event.locals.validate()

  if (session?.userId) {
    const user = await db.user.findUnique({ where: { id: session.userId } })
    if (user) {
      return {
        user,
        db,
        // context information
      }
    }
  }
  return { db }
}

export type Context = inferAsyncReturnType<typeof createContext>
