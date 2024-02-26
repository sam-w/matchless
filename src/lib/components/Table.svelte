<script lang="ts">
    import type { DatabaseRow } from '$lib/database/DatabaseRow';
    import Tag from '$lib/components/Tag.svelte';

    export let rows: DatabaseRow[];
</script>

<div
    class="space-y-8 rounded-lg bg-white/30 p-8 shadow-xl ring-1 ring-gray-900/5 {$$restProps.class}"
>
    <div class="space-y-2">
        <div class="flex flex-row flex-wrap gap-2">
            <Tag text={rows[0].section} />
            >
            <Tag text={rows[0].subsection} />
        </div>
        <p class="text-xl font-semibold">{rows[0].description}</p>
        <p class="text-sm">Quantity: {rows[0].quantity}</p>
    </div>
    <div class="divide-y divide-gray-900/5">
        <table class="w-full text-left">
            <tr>
                <th>Contract</th>
                <th>Part Number</th>
            </tr>
            {#each rows as row}
                <tr>
                    <td>{row.contract_number}</td>
                    <td>{row.part_number}</td>
                </tr>
            {/each}
        </table>
    </div>
</div>
