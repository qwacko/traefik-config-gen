import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const history = await event.locals.trpc.outputs.getOutput({
		outputId: event.params.id,
		historyId: event.params.historyId
	});

	const latestHistory = await event.locals.trpc.outputs.getOutput({ outputId: event.params.id });

	if (!history || !latestHistory) {
		throw redirect(302, '/outputs/' + event.params.id);
	}

	return { history, latestHistory };
};
