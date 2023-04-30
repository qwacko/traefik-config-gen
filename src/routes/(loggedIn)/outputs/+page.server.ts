export const load = async (event) => {
	const data = await event.locals.trpc.outputs.getAll();

	return { outputs: data };
};
