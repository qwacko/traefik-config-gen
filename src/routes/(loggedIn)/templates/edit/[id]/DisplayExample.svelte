<script lang="ts">
	import Stack from '$lib/components/Stack.svelte';
	import Handlebars from 'handlebars';

	export let template: string | undefined;
	export let exampleData: string | undefined | null = undefined;

	const processExample = (template: string | undefined, exampleData: string | undefined | null) => {
		const processed = Handlebars.compile(template);
		try {
			const result = processed(JSON.parse(exampleData || '{}'));
			return result;
		} catch (e) {
			return 'Template Error';
		}
	};

	$: example = processExample(template, exampleData);
</script>

<pre>{example}</pre>
