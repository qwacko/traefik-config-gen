<script lang="ts">
	export let label: string | undefined = undefined;
</script>

<div>
	<input type="checkbox" {...$$restProps} />
	{#if label}<label for="enabled">{label}</label>{/if}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		gap: 0.2rem;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	input {
		margin-right: 0.5rem;
		border-radius: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		transition: 0.2s ease-in-out;
	}

	input:focus {
		outline: none;
		box-shadow: 0 0 0 0;
	}

	label {
		display: block;
		font-size: 1rem;
		font-weight: 600;
		color: rgb(51, 51, 51);
	}
</style>
