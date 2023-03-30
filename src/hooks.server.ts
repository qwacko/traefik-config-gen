import { auth } from './lib/server/auth/auth'
import { handleHooks } from '@lucia-auth/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import type { Handle } from '@sveltejs/kit'

const sessionProcessing: Handle = async ({ event, resolve }) => {
  console.log('SessionProcessing ---------------')
  const session = await event.locals.validateUser()
  const session2 = await event.locals.validate()
  const cookies = event.cookies.getAll()
  console.log('data', {
    session,
    session2,
    cookies,
  })
  console.log('SessionProcessing Complete -----------')
  return resolve(event)
}
export const handle = sequence(handleHooks(auth), sessionProcessing)
