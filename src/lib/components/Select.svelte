<script lang="ts">
	import ErrorText from './ErrorText.svelte';
	import Row from './Row.svelte';
	import SelectCore from './SelectCore.svelte';

	export let errorMessage: string | string[] | null | undefined = undefined;
	export let title: string | null;
	export let name: string;
	export let options: { key: string; label: string }[] = [];
	export let value: string | null | undefined | string[];
	export let multiple: boolean = false;

	$: console.log('Input Value', value);
</script>

{#if options.length > 0}
	<label class="label">
		{#if title}<span>
				{#if multiple}
					<Row>
						<p>{title} ( {value?.length || '0'} )</p>
						<button on:click={() => (value = [])} class="btn btn-sm variant-ringed-primary">
							Clear
						</button>
						<button
							on:click={() => (value = options.map((o) => o.key))}
							class="btn btn-sm variant-ringed-primary"
						>
							All
						</button>
					</Row>
				{:else}
					{title}
				{/if}
			</span>{/if}
		{#if $$slots.button}
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<slot name="button" />
				<SelectCore {name} {options} bind:value {multiple} />
			</div>
		{:else}
			<SelectCore {name} {options} bind:value {multiple} />
		{/if}
		<ErrorText message={errorMessage} />
	</label>
{:else}
	<ErrorText message="{title ? `${title} : ` : ''}No Options" />
{/if}
