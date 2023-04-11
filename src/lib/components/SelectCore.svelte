<script lang="ts">
	export let name: string;
	export let options: { key: string; label: string }[] = [];
	export let value: string | null | undefined | string[];
	export let multiple: boolean = false;
</script>

{#if multiple}
	<select {name} multiple size="2" class="select" bind:value {...$$restProps}>
		{#each options as currentOption}
			<option value={currentOption.key}>{currentOption.label}</option>
		{/each}
	</select>
{:else}
	<select {name} class="select" bind:value {...$$restProps}>
		{#each options as currentOption}
			<option value={currentOption.key}>{currentOption.label}</option>
		{/each}
	</select>
{/if}
