<script lang="ts">
	import ErrorText from './ErrorText.svelte';

	export let errorMessage: string | string[] | null | undefined;
	export let title: string | null;
	export let name: string;
</script>

<label class="label">
	{title}
	<input class="input p-2" {...$$restProps} {name} />
	<ErrorText message={errorMessage} />
</label>
