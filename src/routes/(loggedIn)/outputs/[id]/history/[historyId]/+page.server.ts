export const load = async (event) => {
	const history = await event.locals.trpc.outputs.getOutput({
		outputId: event.params.id,
		historyId: event.params.historyId
	});

	return { history };
};
