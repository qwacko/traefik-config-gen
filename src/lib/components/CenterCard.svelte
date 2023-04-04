<script lang="ts">
	import Center from './Center.svelte';

	export let title: string | null;

	export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined = undefined;

	export let style:
		| undefined
		| 'bg-initial'
		| 'variant-filled-primary'
		| 'variant-filled-secondary'
		| 'variant-filled-success'
		| 'variant-filled-warning'
		| 'variant-filled-error'
		| 'variant-ghost-primary'
		| 'variant-ghost-secondary' = 'bg-initial';
</script>

<div class="p-6">
	<Center>
		<div
			class="card {style}  w-[600px]"
			class:w-48={size === 'xs'}
			class:w-60={size === 'sm'}
			class:w-72={size === 'md'}
			class:w-96={size === 'lg'}
			class:w-[600px]={size === 'xl'}
		>
			{#if title}
				<header class="card-header">
					<h2>{title}</h2>
				</header>
			{/if}
			<section class="p-4"><slot /></section>
			{#if $$slots.footer}
				<footer class="card-footer">
					<slot name="footer" />
				</footer>
			{/if}
		</div>
	</Center>
</div>
