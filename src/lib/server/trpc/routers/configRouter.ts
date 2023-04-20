import { updateFromConfig } from '../helpers/updateFromConfig';
import { authMiddleware } from '../middleware/auth';
import { t } from '../t';

export const configRouter = t.router({
	update: t.procedure.use(authMiddleware).mutation(async ({ ctx }) => {
		await updateFromConfig({ prisma: ctx.prisma });
	})
});
