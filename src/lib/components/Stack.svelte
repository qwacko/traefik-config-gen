<script lang="ts">
	export let gap: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' = '4';
	export let alignment: 'left' | 'center' | 'right' | undefined = undefined;
	export let width: 'full' | 'fit' | undefined = undefined;
</script>

<div
	class="flex flex-col gap-{gap} content-center"
	class:w-full={width === 'full'}
	class:w-fit={width === 'fit'}
	class:items-center={alignment === 'center'}
	class:items-end={alignment === 'right'}
	class:items-start={alignment === 'left'}
>
	<slot />
</div>
