import { createContext } from '$lib/trpc/context'
import { router } from '$lib/trpc/router'
import { fail, redirect } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms/server'
import { createSourceValidation } from './createSourceValidation'

export const load = async (event) => {
  const createForm = await superValidate(event, createSourceValidation)
  return { createForm }
}

export const actions = {
  createNew: async (event) => {
    const context = await createContext(event)
    const createForm = await superValidate(event, createSourceValidation, {
      id: 'createSourceForm',
    })
    if (!createForm.valid) {
      console.log('Invalid Form')
      return fail(400, { createForm })
    }

    try {
      const data = await router
        .createCaller(context)
        .source.addSource(createForm.data)

      if (data) {
        throw redirect(300, `/sources/${data.id}`)
      }
      return { createForm }
    } catch (error) {
      return fail(400, {
        createForm: { ...createForm, message: 'Error Creating Source' },
      })
    }
  },
}
