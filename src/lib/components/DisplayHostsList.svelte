<script lang="ts">
	import type { Host, Parameter } from '@prisma/client';
	import ActionButtons from './ActionButtons.svelte';
	import Row from './Row.svelte';
	import Space from './Space.svelte';
	import Stack from './Stack.svelte';

	export let hosts: (Host & {
		parameters: Parameter[];
	})[] = [];
</script>

<Stack>
	{#each hosts as host}
		<Row>
			<Stack gap="0">
				<h5>{host.title}</h5>
				{#each host.parameters as parameter}
					<Row>
						<p class="font-bold">{parameter.label} :</p>
						<p>{parameter.value}</p>
					</Row>
				{/each}
			</Stack>
			<Space />
			<ActionButtons title={host.title} id={host.id} urlPrefix="hosts" />
		</Row>
	{/each}
</Stack>
