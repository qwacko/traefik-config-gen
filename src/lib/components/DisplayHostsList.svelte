<script lang="ts">
	import type { Host, Parameter, Source } from '@prisma/client';
	import ActionButtons from './ActionButtons.svelte';
	import Row from './Row.svelte';
	import Space from './Space.svelte';
	import Stack from './Stack.svelte';
	import SourceBadge from './SourceBadge.svelte';

	export let hosts: (Host & {
		parameters: Parameter[];
		source: Source;
	})[] = [];
</script>

<Stack>
	{#if hosts.length === 0}
		<p>No Hosts Found.</p>
	{:else}
		{#each hosts as host}
			<Row>
				<Stack gap="0">
					<Row>
						<h5>{host.title}</h5>
						<SourceBadge source={host.source} />
					</Row>
					{#each host.parameters as parameter}
						<Row>
							<p class="font-bold">{parameter.label} :</p>
							<p>{parameter.value}</p>
						</Row>
					{/each}
				</Stack>
				<Space />
				<ActionButtons
					title={host.title}
					id={host.id}
					urlPrefix="hosts"
					hideDelete={!host.editable}
					hideEdit={!host.editable}
				/>
			</Row>
		{/each}
	{/if}
</Stack>
