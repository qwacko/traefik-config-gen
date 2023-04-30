<script lang="ts">
	import Row from './Row.svelte';

	export let key: string;
	export let value: string | undefined | null | number;
	export let hideIfEmpty: boolean = false;
</script>

{#if !hideIfEmpty || (value && value !== '')}
	<Row>
		<p class="font-bold">{key} :</p>
		<p>{value}</p>
	</Row>
{/if}
