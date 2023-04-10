<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import Stack from '$lib/components/Stack.svelte';
	import { getVariableGroups } from '$lib/helpers/processTemplate';
	import DisplayExample from './DisplayExample.svelte';
	import type { CalledRouter } from '$lib/server/trpc/router';

	export let host: NonNullable<Awaited<ReturnType<CalledRouter['hosts']['get']>>>;
</script>

{#if host}
	<CenterCard title="Output" size="xl">
		<Stack>
			<h3>Variables Available</h3>
			<pre>{JSON.stringify(host.variables, undefined, 2)}</pre>
			<h3>Variables Used</h3>
			<pre>{JSON.stringify(
					getVariableGroups([host.router?.template || '', host.service?.template || "'"]),
					undefined,
					2
				)}</pre>
			<h3>Router</h3>
			<DisplayExample template={host.router?.template} exampleData={host.variables} />
			<h3>Service</h3>
			<DisplayExample template={host.service?.template} exampleData={host.variables} />
		</Stack>
	</CenterCard>
{/if}
