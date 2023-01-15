<script lang="ts">
let expanded = false
export let expandMin: number = 3

export let sourceData: any

$: isArray = Array.isArray(sourceData)
$: isObject = !isArray && typeof sourceData === 'object' && sourceData !== null
$: objectKeys = isObject ? Object.keys(sourceData) : []
$: itemLength = isArray
  ? (sourceData.length as number)
  : isObject
  ? objectKeys.length
  : 0
$: expandedInternal = expanded || itemLength <= expandMin
</script>

<code class="w-full flex flex-col gap-1 ml-2">
  {#if isArray}
    {#if expandedInternal}
      <div class="flex flex-row gap-2">
        [
        <button
          class="inline text-gray-400 bg-gray-200  rounded-md border border-gray-400 w-min px-2"
          on:click="{() => (expanded = false)}">
          -
        </button>
      </div>
      <div class="ml-4">
        {#each sourceData as currentItem}
          <svelte:self sourceData="{currentItem}" expandMin="{expandMin}" />
        {/each}
      </div>
      ]
    {:else}
      <div class="flex flex-row gap-2">
        [
        <button
          class="inline text-gray-400 bg-gray-200  rounded-md border border-gray-400 w-fit px-2"
          on:click="{() => (expanded = true)}">
          + {sourceData.length}
        </button>
        ]
      </div>
    {/if}
  {:else if isObject}
    {#if expandedInternal}
      <div class="flex flex-row gap-2">
        &#123;
        <button
          class="inline text-gray-400 bg-gray-200  rounded-md border border-gray-400 w-min px-2"
          on:click="{() => (expanded = false)}">
          -
        </button>
      </div>
      <div class="ml-6">
        {#each objectKeys as currentKey}
          <div class="flex flex-row gap-2">
            <div class="flex flex-nowrap whitespace-nowrap">{currentKey} :</div>
            <svelte:self
              sourceData="{sourceData[currentKey]}"
              expandMin="{expandMin}" />
          </div>
        {/each}
      </div>
      &#125;
    {:else}
      <div class="flex flex-row gap-2">
        &#123;<button
          class="inline text-gray-400 bg-gray-200  rounded-md border border-gray-400 w-min px-2"
          on:click="{() => (expanded = true)}">
          +
        </button>
        &#125;
      </div>
    {/if}
  {:else}{JSON.stringify(sourceData)}{/if}
</code>
