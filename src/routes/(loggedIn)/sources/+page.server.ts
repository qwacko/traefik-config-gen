import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const sources = await event.locals.trpc.sources.getSources();

	if (sources.length === 0) {
		throw redirect(302, '/sources/create');
	}

	return { sources };
};
