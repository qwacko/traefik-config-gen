export const load = async (event) => {
	const history = await event.locals.trpc.outputs.getAllHistory({ id: event.params.id });

	console.log(history);
	return { history };
};
