import type { RequestEvent } from '@sveltejs/kit'
import type { inferAsyncReturnType } from '@trpc/server'
import { db } from '../server/db/db'

export async function createContext(event: RequestEvent) {
  const session = await event.locals.validate()
  console.log('Session (createContext)', session)
  const cookies = await event.cookies.getAll()
  console.log('cookies (createContext)', cookies)

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
