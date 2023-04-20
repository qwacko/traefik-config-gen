import type { inferRouterOutputs } from '@trpc/server';
import { configRouter } from './routers/configRouter';
import { hostRouter } from './routers/hostRouter';
import { outputRouter } from './routers/outputRouter';
import { sourceRouter } from './routers/sourceRouter';
import { templateRouter } from './routers/templateRouter';
import { userRouter } from './routers/user';
import { t } from './t';

export const router = t.router({
	users: userRouter,
	sources: sourceRouter,
	templates: templateRouter,
	hosts: hostRouter,
	outputs: outputRouter,
	config: configRouter
});

export type Router = typeof router;
export type CalledRouter = ReturnType<Router['createCaller']>;
export type RouterOutput = inferRouterOutputs<Router>;
