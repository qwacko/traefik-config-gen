<script lang="ts">
	import CenterCard from '$lib/components/CenterCard.svelte';
	import DisplayTemplateList from '$lib/components/DisplayTemplateList.svelte';
	import Stack from '$lib/components/Stack.svelte';

	export let data;
</script>

<Stack alignment="center" gap="0">
	<CenterCard title="Router Templates" size="xl">
		<Stack>
			<DisplayTemplateList type="Router" templates={data.routerTemplates} />
			<a href="/templates/createRouter" class="btn variant-filled-primary">New Router Template</a>
		</Stack>
	</CenterCard>
	<CenterCard title="Service Templates" size="xl">
		<Stack>
			<DisplayTemplateList type="Service" templates={data.serviceTemplates} />
			<a href="/templates/createService" class="btn variant-filled-primary">New Service Template</a>
		</Stack>
	</CenterCard>
</Stack>
