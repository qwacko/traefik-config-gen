import lucia from 'lucia-auth'
import prisma from '@lucia-auth/adapter-prisma'
import { dev } from '$app/environment'
import { db } from '../db/db'

export const auth = lucia({
  adapter: prisma(db),
  env: dev ? 'DEV' : 'PROD',
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
    }
  },
})

export type Auth = typeof auth
