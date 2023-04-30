import { trpc } from '$lib/clientTRPC';

// 👇 this method will be invoked on BOTH the server and the client, as needed ⚠️
export const load = async (event) => {
	return {
		users: trpc(event).users.users.query()
	};
};
