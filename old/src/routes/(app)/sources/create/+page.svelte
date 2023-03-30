<script>
import { Input, Label, Select, Button, Checkbox } from 'flowbite-svelte'
import { superForm } from 'sveltekit-superforms/client'
import { createSourceValidation } from './createSourceValidation'

export let data

const { form: createForm, errors, constraints, enhance } = superForm(data.createForm)
</script>

<div class="w-full flex flex-col items-center">
  <form
    class="flex flex-col space-y-6 items-stretch w-96"
    method="POST"
    use:enhance
    action="?/createNew">
    <label class="text-lg font-bold" for="name">Title</label>
    <input
      class="border-2 border-blue-400 rounded-lg py-2 px-4"
      type="text"
      name="title"
      placeholder="Title"
      bind:value={$createForm.title}
      data-invalid={$errors.title}
      {...$constraints.title} />
    {#if $errors.title}
      <span class="text-red-600">
        {$errors.title}
      </span>
    {/if}
    <label class="text-lg font-bold" for="type">Type</label>
    <select
      class="border-2 border-blue-400 rounded-lg py-2 px-4"
      name="type"
      bind:value={$createForm.type}
      data-invalid={$errors.type}
      {...$constraints.type}>
      <option value="docker">Docker</option>
      <option value="manual">Web</option>
      <option value="yaml">YAML File</option>
      <option value="other">Other</option>
    </select>
    {#if $errors.type}
      <span class="text-red-600">
        {$errors.type}
      </span>
    {/if}
    <label class="text-lg font-bold" for="address">Address</label>
    <input
      class="border-2 border-blue-400 rounded-lg py-2 px-4"
      type="text"
      name="address"
      placeholder="Address"
      bind:value={$createForm.address}
      data-invalid={$errors.address}
      {...$constraints.address} />
    {#if $errors.address}
      <span class="text-red-600">
        {$errors.address}
      </span>
    {/if}
    <div class="flex items-center">
      <label class="text-lg font-bold mr-4" for="autoDelete">Auto Delete</label>
      <input
        class="border-2 border-blue-400 rounded-lg py-2 px-4"
        type="checkbox"
        name="autoDelete"
        bind:checked={$createForm.autoDelete} />
    </div>
    <div class="flex items-center">
      <label class="text-lg font-bold mr-4" for="enabled">Enabled</label>
      <input
        class="border-2 border-blue-400 rounded-lg py-2 px-4"
        type="checkbox"
        name="enabled"
        bind:checked={$createForm.enabled} />
    </div>
    <button
      class="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out"
      type="submit">Create</button>
  </form>
</div>
