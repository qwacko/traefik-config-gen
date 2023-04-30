<script lang="ts">
	import { processTemplate } from '$lib/helpers/processTemplate';

	export let template: string | undefined;

	export let exampleData:
		| string
		| undefined
		| null
		| Record<string, string | Record<string, string>> = undefined;

	$: example = processTemplate({ template, variables: exampleData, errorReturn: 'Template Error' });
</script>

<pre>{example}</pre>
