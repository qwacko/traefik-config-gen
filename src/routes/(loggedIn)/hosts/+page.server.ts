export const load = async (event) => {
	const hosts = await event.locals.trpc.hosts.getHosts();

	return { hosts };
};
