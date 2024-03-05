<script lang="ts">
    import type { SearchResult } from '$lib/database/search';
    import type { Part } from '$lib/database/part';

    import Tag from '$lib/components/Tag.svelte';

    export let rows: SearchResult[];

    const part = rows[0] as Part;
</script>

<div
    class="space-y-8 rounded-lg bg-white/30 p-8 shadow-xl ring-1 ring-gray-900/5 {$$restProps.class}"
>
    <div class="space-y-2">
        <div class="flex flex-row flex-wrap gap-2">
            <Tag text={part.section} />
            >
            <Tag text={part.subsection} />
        </div>
        <p class="text-xl font-semibold"><a href="/part/{part.id}">{part.description}</a></p>
        <p class="text-sm">Quantity: {part.quantity}</p>
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
