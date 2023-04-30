<script lang="ts">
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
	export let disabled: boolean = false;
	export let value: string | null | undefined;
	export let height: undefined | 'xl' | 'lg' | 'md' | 'sm' = undefined;
</script>

<label class="label">
	{title}
	<textarea
		class="input p-2"
		class:h-64={height === 'xl'}
		class:h-48={height === 'lg'}
		class:h-32={height === 'md'}
		class:h-24={height === 'sm'}
		bind:value
		{...$$restProps}
		{name}
		{disabled}
	/>
	<ErrorText message={errorMessage} />
</label>
