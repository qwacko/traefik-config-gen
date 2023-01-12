<script lang="ts">
	import { getUser } from "@lucia-auth/sveltekit/client";

	const user = getUser();
</script>

<h1>Profile</h1>
<div>
	<p>User id: {$user?.userId}</p>
	<p>Username: {$user?.username}</p>
</div>