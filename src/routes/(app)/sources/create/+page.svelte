<script>
import { Input, Label, Select, Button, Checkbox } from 'flowbite-svelte'
import { enhance } from '$app/forms'
</script>

<form
  class="flex flex-col space-y-6"
  method="POST"
  use:enhance
  action="?/create">
  <Label class="space-y-2">
    <span>Title</span>
    <Input type="text" name="title" placeholder="Title" required />
    <!-- {#if fieldErrors?.username}
        <P size="xs" class="text-red-600">{fieldErrors.username}</P>
      {/if} -->
  </Label>
  <Label class="space-y-2">
    <span>Type</span>
    <Select
      value="docker"
      name="type"
      items="{[
        { name: 'Docker', value: 'docker' },
        { name: 'Web', value: 'manual' },
        { name: 'YAML File', value: 'yaml' },
        { name: 'Other', value: 'other' },
      ]}" />
    <!-- {#if fieldErrors?.username}
        <P size="xs" class="text-red-600">{fieldErrors.username}</P>
      {/if} -->
  </Label>
  <Label class="space-y-2">
    <span>Address</span>
    <Input type="text" name="address" placeholder="Address" required />
    <!-- {#if fieldErrors?.username}
        <P size="xs" class="text-red-600">{fieldErrors.username}</P>
      {/if} -->
  </Label>

  <div class="flex flex-row gap-5">
    <Label class="space-y-2 flex flex-col">
      <span class="flex">Auto Delete</span>
      <Checkbox name="autoDelete" />
    </Label>
    <Label class="space-y-2 flex flex-col">
      <span class="flex">Enabled</span>
      <Checkbox name="enabled" checked />
    </Label>
  </div>

  <Button type="submit">Create</Button>
</form>
