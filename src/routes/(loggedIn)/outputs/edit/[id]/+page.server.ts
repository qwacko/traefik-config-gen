import { updateOutputSchema, type UpdateOutputSchemaType } from '$lib/schema/outputSchema';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { z } from 'zod';

export const load = async (event) => {
	const currentDataPromise = event.locals.trpc.outputs.get({ id: event.params.id });
	const sourcesRaw = event.locals.trpc.sources.getSources();
	const hostsRaw = event.locals.trpc.hosts.getHosts();
	const currentData = await currentDataPromise;

	if (!currentData) throw redirect(302, '/outputs');

	const newCurrentData: z.infer<UpdateOutputSchemaType> = {
		id: currentData.id,
		address: currentData.address,
		title: currentData.title,
		autoUpdate: currentData.autoUpdate,
		includedHosts: currentData.includedHosts.map((host) => host.id),
		excludedHosts: currentData.excludedHosts.map((host) => host.id),
		includedSources: currentData.includedSources.map((source) => source.id),
		excludedSources: currentData.excludedSources.map((source) => source.id)
	};

	const form = await superValidate(newCurrentData, updateOutputSchema);

	const sources = (await sourcesRaw).map((source) => ({ key: source.id, label: source.title }));
	const hosts = (await hostsRaw).map((host) => ({ key: host.id, label: host.title }));

	return { form, sources, hosts };
};
