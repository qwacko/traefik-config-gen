import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
  const session = await locals.validate()
  if (session) throw redirect(302, '/')
}
