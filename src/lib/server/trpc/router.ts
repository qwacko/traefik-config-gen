import { hostRouter } from './routers/hostRouter';
import { sourceRouter } from './routers/sourceRouter';
import { templateRouter } from './routers/templateRouter';
import { userRouter } from './routers/user';
import { t } from './t';

export const router = t.router({
	users: userRouter,
	sources: sourceRouter,
	templates: templateRouter,
	hosts: hostRouter
});

export type Router = typeof router;
export type CalledRouter = ReturnType<Router['createCaller']>;
