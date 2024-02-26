<script lang="ts">
    import Table from '../lib/Table.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;

    const refreshPage = () => location.reload();
</script>

<main class="relative flex min-h-screen flex-col items-center justify-center py-10">
    <form method="POST" class="grid grid-cols-2 space-y-5">
        <label for="part_name"> Part: </label>
        <input id="part_name" name="part_name" type="text" />
        <label for="part_number"> Part Number: </label>
        <input id="part_number" name="part_number" type="text" />
        <label for="contract"> Contract: </label>
        <input id="contract" name="contract" type="text" />
        <button>Submit</button>
    </form>
    {#if form}
        <div class="mb-4 flex items-center justify-between">
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
