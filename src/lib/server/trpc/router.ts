import { sourceRouter } from './routers/sourceRouter';
import { userRouter } from './routers/user';
import { t } from './t';

export const router = t.router({
	users: userRouter,
	sources: sourceRouter
});

export type Router = typeof router;
export type CalledRouter = ReturnType<Router['createCaller']>;
