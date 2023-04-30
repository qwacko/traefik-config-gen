<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import IconAccountBox from '~icons/mdi/pencil';

	export let message: string | null | undefined = undefined;
	export let id: string = '';

	let popupSettings: PopupSettings = {
		// Set the event as: click | hover | hover-click | focus | focus-click
		event: 'hover',
		// Provide a matching 'data-popup' value.
		target: `buttonPopup-${id}`
	};
</script>

<div use:popup={popupSettings}>
	<slot />
	{#if message}
		<div data-popup="buttonPopup-{id}" class="card variant-filled p-4 w-fit">
			{message}
		</div>
	{/if}
</div>
