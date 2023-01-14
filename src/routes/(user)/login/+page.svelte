<script lang="ts">
import type { ActionData } from './$types'
import { Card, Button, Label, Input, Checkbox, Alert, P } from 'flowbite-svelte'
import { enhance } from '$app/forms'

export let form: ActionData

$: fieldErrors =
  form?.errors && 'fieldErrors' in form.errors
    ? form.errors.fieldErrors
    : undefined
</script>

<Card class="flex mt-24 w-80">
  <form class="flex flex-col space-y-6" method="POST" use:enhance>
    <h3 class="text-xl font-medium text-gray-900 dark:text-white p-0">
      Sign in
    </h3>
    <Label class="space-y-2">
      <span>Username</span>
      <Input type="text" name="username" placeholder="Username" required />
      {#if fieldErrors?.username}
        <P size="xs" class="text-red-600">{fieldErrors.username}</P>
      {/if}
    </Label>
    <Label class="space-y-2">
      <span>Password</span>
      <Input type="password" name="password" placeholder="•••••" required />
      {#if fieldErrors?.password}
        <P size="xs" class="text-red-600">{fieldErrors.password}</P>
      {/if}
    </Label>
    {#if form?.errors?.formErrors && Array.isArray(form?.errors?.formErrors)}
      {#each form.errors.formErrors as currentError}
        <P size="xs" class="text-red-600">{currentError}</P>
      {/each}
    {/if}
    <Button type="submit" class="w-full">Login</Button>
    <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
      Not registered? <a
        href="/"
        class="text-blue-700 hover:underline dark:text-blue-500"
        >Create account</a>
    </div>
  </form>
</Card>
