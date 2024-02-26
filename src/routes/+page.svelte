<script lang="ts">
    import type { SubmitFunction } from '@sveltejs/kit';

    import { enhance } from '$app/forms';

    import Table from '$lib/components/Table.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;

    let isLoading = false;

    const onSubmit = (() => {
        isLoading = true;
        return ({ update }) => {
            isLoading = false;
            void update();
        };
    }) satisfies SubmitFunction;
</script>

<main
    class="flex min-h-screen flex-col items-center justify-center space-y-6 px-2 py-10 md:space-y-12"
>
    <form
        method="POST"
        use:enhance={onSubmit}
        class="grid w-full max-w-xl items-center gap-4 text-right [grid-template-columns:0fr_1fr] *:text-nowrap"
    >
        <label for="part_name"> Part: </label>
        <input id="part_name" name="part_name" type="text" />
        <label for="part_number"> Part Number: </label>
        <input id="part_number" name="part_number" type="text" />
        <label for="contract"> Contract: </label>
        <input id="contract" name="contract" type="text" />
        {#if form?.error}
            <p class="text-left font-semibold text-red-500 [grid-column:2]">{form.error}</p>
        {/if}
        <button class="[grid-column:2]" disabled={isLoading}>
            {#if isLoading}
                ...
            {:else}
                Search
            {/if}
        </button>
    </form>
    {#if form?.results}
        <div class="mx-auto !mt-12 w-full max-w-xl space-y-1">
            <p class="text-sm text-gray-500">
                Fetched {form.results.count} results in {form.results.duration} ms
            </p>
            <h2 class="font-mono text-xs text-gray-400">{form.results.whereClauses}</h2>
        </div>
        {#each Object.entries(form.results.groups) as [key, value] (key)}
            <Table rows={value} class="mx-auto w-full max-w-xl" />
        {/each}
    {/if}
</main>
