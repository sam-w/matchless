<script lang="ts">
    import { onMount } from 'svelte';
    import type { SubmitFunction } from '@sveltejs/kit';

    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    import { pushState } from '$app/navigation';

    import Table from '$lib/components/Table.svelte';

    import type { ActionData } from './$types';

    export let form: ActionData;

    const fields = ['part_name', 'part_number', 'contract'] as const;
    type SearchParams = Partial<{
        [k in (typeof fields)[number]]: string;
    }>;

    const params = Object.fromEntries(
        fields
            .map((k) => ({
                k,
                v: $page.url.searchParams.get(k)
            }))
            .filter(({ v }) => !!v)
            .map(({ k, v }) => [k, decodeURIComponent(v)])
    ) as SearchParams;

    let formElement: HTMLFormElement;
    let isLoading = false;

    const onSubmit = (() => {
        isLoading = true;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return async ({ formData, update }) => {
            const terms = fields
                .map((k) => ({ k, v: (formData.get(k) as string) || undefined }))
                .filter(({ v }) => v);
            if (terms.length) {
                const params = terms.map(({ k, v }) => `${k}=${encodeURIComponent(v!)}`).join('&');
                pushState(
                    `?${params}`,
                    Object.fromEntries(terms.map(({ k, v }) => [k, v])) as SearchParams
                );
            }
            isLoading = false;
            await update({ reset: false });
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
        bind:this={formElement}
    >
        <label for="part_name"> Part: </label>
        <input id="part_name" name="part_name" type="text" value={params.part_name ?? ''} />
        <label for="part_number"> Part Number: </label>
        <input id="part_number" name="part_number" type="text" value={params.part_number ?? ''} />
        <label for="contract"> Contract: </label>
        <input id="contract" name="contract" type="text" value={params.contract ?? ''} />
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
