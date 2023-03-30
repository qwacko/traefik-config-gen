<script>
import { invalidateAll, goto } from '$app/navigation'
import { Input, Label, Select, Button, Checkbox } from 'flowbite-svelte'

import { useCreateTemplate } from './useCreateTemplate'

$: [formValue, formActions] = useCreateTemplate({
  onMutateComplete: async (newId) => {
    await goto(`/templates/${newId}`)
    await invalidateAll()
  },
})
</script>

<div class="w-full flex flex-col items-center">
  <form class="flex flex-col space-y-6 items-stretch w-96" method="POST">
    <Label class="space-y-2">
      <span>Title</span>
      <Input
        type="text"
        name="title"
        placeholder="Title"
        bind:value={$formValue.title}
        required />
    </Label>
    <Label class="space-y-2">
      <span>Type</span>
      <Select
        bind:value={$formValue.type}
        name="type"
        items={[
          { name: 'Router', value: 'router' },
          { name: 'Service', value: 'service' },
        ]} />
    </Label>
    <Label class="space-y-2">
      <span>Template</span>
      <Input
        type="text"
        bind:value={$formValue.template}
        placeholder="Template"
        required />
    </Label>

    <Button on:click={formActions.mutate}>Create</Button>
  </form>
</div>
