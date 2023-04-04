<script lang="ts">
	export let alignment: 'top' | 'middle' | 'bottom' | 'stretch' = 'middle';
	export let gap: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' = '4';
</script>

<div
	class="flex flex-row gap-{gap}"
	class:items-center={alignment === 'middle'}
	class:items-start={alignment === 'top'}
	class:items-end={alignment === 'bottom'}
	class:items-stretch={alignment === 'stretch'}
>
	<slot />
</div>
