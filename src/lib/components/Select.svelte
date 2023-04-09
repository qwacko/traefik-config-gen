<script lang="ts">
	import ErrorText from './ErrorText.svelte';
	import Row from './Row.svelte';
	import EditIcon from './Icons/EditIcon.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let options: { key: string; label: string }[] = [];
	export let value: string | null | undefined;
</script>

{#if options.length > 0}
	<label class="label">
		{#if title}<span>{title}</span>{/if}
		{#if $$slots.button}
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<slot name="button" />
				<select {name} class="select" bind:value {...$$restProps}>
					{#each options as currentOption}
						<option value={currentOption.key}>{currentOption.label}</option>
					{/each}
				</select>
			</div>
		{:else}
			<select {name} class="select" bind:value {...$$restProps}>
				{#each options as currentOption}
					<option value={currentOption.key}>{currentOption.label}</option>
				{/each}
			</select>
		{/if}
		<ErrorText message={errorMessage} />
	</label>
{:else}
	<ErrorText message="{title ? `${title} : ` : ''}No Options" />
{/if}
