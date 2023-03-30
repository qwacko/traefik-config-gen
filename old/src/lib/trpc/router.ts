import { t } from './t'
import { templateRouter } from './routers/templateRouter'
import { sourceRouter } from './routers/sourceRouter'

export const router = t.router({
  template: templateRouter,
  source: sourceRouter,
})

export type Router = typeof router
export type RouterCaller = ReturnType<Router['createCaller']>
