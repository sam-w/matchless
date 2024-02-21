<script lang="ts">
  import Table from '../lib/Table.svelte'

  import type { ActionData } from './$types';
  
  export let form: ActionData

  const refreshPage = () => location.reload();
</script>

<main
  class="relative flex flex-col items-center justify-center min-h-screen py-10"
>
  <form method="POST" class="flex flex-col space-y-5">
    <label>
      Part:
      <input name="part_name" type="text">
    </label>
    <label>
      Part Number:
      <input name="part_number" type="text">
    </label>
    <label>
      Contract:
      <input name="contract" type="text">
    </label>
    <button>Submit</button>
  </form>
  {#if form}
    <div class="flex items-center justify-between mb-4">
      <div class="space-y-1">
        <h2 class="text-xl font-semibold">Query: {form.whereClauses}</h2>
        <p class="text-sm text-gray-500">
          Fetched {form.resultCount} results in {form.duration} ms
        </p>
      </div>
      <button on:click={refreshPage}>Clear</button>
    </div>
    {#each Object.entries(form.grouped) as [key, value]}
      <Table rows={value} />  
    {/each}
  {/if}
</main>
