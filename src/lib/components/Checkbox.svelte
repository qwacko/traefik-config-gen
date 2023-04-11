<script lang="ts">
	import ErrorText from './ErrorText.svelte';
	import Row from './Row.svelte';

	export let errorMessage: string | string[] | null | undefined = undefined;
	export let title: string | null;
	export let name: string;
	export let disabled: boolean = false;
	export let value: boolean | undefined = undefined;
</script>

<label class="label">
	<Row alignment="middle">
		<input
			type="checkbox"
			class="checkbox p-2"
			bind:checked={value}
			{...$$restProps}
			{name}
			{disabled}
		/>
		{title}
	</Row>
	<ErrorText message={errorMessage} />
</label>
