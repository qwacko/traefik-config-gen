<script lang="ts">
	import DeleteIcon from './Icons/DeleteIcon.svelte';
	import EditIcon from './Icons/EditIcon.svelte';
	import InfoIcon from './Icons/InfoIcon.svelte';
	import ListIcon from './Icons/ListIcon.svelte';
	import Popover from './Popover.svelte';
	import Row from './Row.svelte';

	export let title: string;
	export let id: string;
	export let urlPrefix: string;

	export let hideEdit: boolean = false;
	export let hideView: boolean = false;
	export let hideDelete: boolean = false;
	export let showList: boolean = false;

	export let editHighlighted: boolean = false;
	export let viewHighlighted: boolean = false;
	export let deleteHighlighted: boolean = false;
	export let listHighlighted: boolean = false;

	export let hidePopups: boolean = false;
</script>

<Row>
	<slot name="firstButtons" />
	{#if showList}
		<Popover message={hidePopups ? undefined : `List`} id="list">
			<a
				href="/{urlPrefix}"
				class="btn-icon"
				class:variant-filled-primary={listHighlighted}
				class:variant-ghost-secondary={!listHighlighted}
			>
				<ListIcon />
			</a>
		</Popover>
	{/if}
	{#if !hideView}
		<Popover message={hidePopups ? undefined : `View ${title}`} id="view">
			<a
				href="/{urlPrefix}/{id}"
				class="btn-icon"
				class:variant-filled-primary={viewHighlighted}
				class:variant-ghost-secondary={!viewHighlighted}
			>
				<InfoIcon />
			</a>
		</Popover>
	{/if}

	{#if !hideEdit}
		<Popover message={hidePopups ? undefined : `Edit ${title}`} id="edit">
			<a
				href="/{urlPrefix}/{id}/edit"
				class="btn-icon"
				class:variant-filled-primary={editHighlighted}
				class:variant-ghost-secondary={!editHighlighted}
			>
				<EditIcon />
			</a>
		</Popover>
	{/if}

	{#if !hideDelete}
		<Popover message={hidePopups ? undefined : `Delete ${title}`} id="delete">
			<a
				href="/{urlPrefix}/{id}/delete"
				class="btn-icon"
				class:variant-filled-primary={deleteHighlighted}
				class:variant-ghost-secondary={!deleteHighlighted}
			>
				<DeleteIcon />
			</a>
		</Popover>
	{/if}
	<slot name="lastButtons" />
</Row>
