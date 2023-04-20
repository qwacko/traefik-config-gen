export const actions = {
	default: async (event) => {
		await event.locals.trpc.config.update();
	}
};
