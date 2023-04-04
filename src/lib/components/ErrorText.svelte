<script lang="ts">
	export let message: string | string[] | null = null;
</script>

{#if message && message.length > 0}
	<div class="aler variant-soft-error p-2 mt-1">
		<span class="alert-message">{message}</span>
	</div>
{/if}
