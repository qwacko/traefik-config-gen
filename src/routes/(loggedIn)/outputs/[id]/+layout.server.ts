import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const currentDataPromise = event.locals.trpc.outputs.get({ id: event.params.id });
	const sourcesRaw = event.locals.trpc.sources.getSources();
	const hostsRaw = event.locals.trpc.hosts.getHosts();
	const currentData = await currentDataPromise;

	if (!currentData) throw redirect(302, '/outputs');

	const sources = (await sourcesRaw).map((source) => ({ key: source.id, label: source.title }));
	const hosts = (await hostsRaw).map((host) => ({ key: host.id, label: host.title }));

	return { output: currentData, sources, hosts };
};
