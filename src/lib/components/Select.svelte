<script lang="ts">
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let options: { key: string; label: string }[] = [];
	export let value: string | null | undefined;
</script>

{#if options.length > 0}
	<label class="label">
		{#if title}<span>{title}</span>{/if}
		<select {name} class="select p-2" bind:value {...$$restProps}>
			{#each options as currentOption}
				<option value={currentOption.key}>{currentOption.label}</option>
			{/each}
		</select>
		<ErrorText message={errorMessage} />
	</label>
{:else}
	<ErrorText message="{title ? `${title} : ` : ''}No Options" />
{/if}
