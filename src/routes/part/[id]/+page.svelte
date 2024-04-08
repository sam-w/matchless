<script lang="ts">
    import ImageThumbnail from '$lib/components/ImageThumbnail.svelte';
    import Tag from '$lib/components/Tag.svelte';
    import type { PageData } from './$types';

    export let data: PageData;

    const groupedContractParts = data.contractParts.reduce(
        (acc, contractPart) => ({
            ...acc,
            [contractPart.part_number]: {
                startContractId:
                    acc[contractPart.part_number]?.startContractId ?? contractPart.contract_id,
                endContractId: contractPart.contract_id
            }
        }),
        {} as { [partNumber: string]: { startContractId: number; endContractId: number } }
    );
    const gridRows = Object.entries(groupedContractParts).map(([partNumber, contractRange]) => ({
        partNumber,
        gridRange: {
            start: data.contracts.findIndex((c) => c.id == contractRange.startContractId),
            end: data.contracts.findIndex((c) => c.id == contractRange.endContractId)
        }
    }));
</script>

<h1 class="m-10">Contract detail</h1>

<div class="m-10 space-y-8 rounded-lg bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
    <div class="space-y-2">
        <div class="flex flex-row flex-wrap gap-2">
            <Tag text={data.part.section} />
            >
            <Tag text={data.part.subsection} />
            >
            <Tag class="font-semibold bg-indigo-600" text={data.part.description}/>
        </div>
        <p class="text-sm">Quantity: {data.part.quantity}</p>
    </div>
    <div class="grid gap-y-2" style="grid-template-columns: {data.contracts.length + 1}">
        {#each data.contracts as contract, index}
            <p
                class="border-r border-black p-2 text-center text-xs"
                style="grid-column: {index + 1}; grid-row: 1"
            >
                {contract.contract_number}
            </p>
        {/each}
        {#each gridRows as row}
            <div
                style="grid-row:2; grid-column-start: {row.gridRange.start +
                    1}; grid-column-end: {row.gridRange.end + 1}"
            >
                <div class="bg-slate-600 p-2 text-center text-sm text-white">{row.partNumber}</div>
            </div>
        {/each}
    </div>
</div>

<h1 class="m-10">Images</h1>

{#if data.sectionImages.length}
    <div class="m-10 space-y-8 rounded-lg bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
        <div class="space-y-2">
            <div class="flex flex-row flex-wrap gap-2">
                <Tag text={data.part.section} />
            </div>
            <h2>Section images:</h2>
        </div>
        <div class="flex flex-row gap-4">

            {#each data.sectionImages as image}
            <ImageThumbnail url={image} />
            {/each}
        </div>
    </div>
{/if}

{#if data.subSectionImages.length}
    <div class="m-10 space-y-8 rounded-lg bg-white/30 p-8 shadow-xl ring-1 ring-gray-900/5">
        <div class="space-y-2">
            <div class="flex flex-row flex-wrap gap-2">
                <Tag text={data.part.subsection} />
            </div>
            <h2>Subsection images:</h2>
        </div>
        {#each data.subSectionImages as image}
            <ImageThumbnail url={image} />
        {/each}
    </div>
{/if}

{#if data.partImages.length}
    <div class="m-10 space-y-8 rounded-lg bg-white p-8 shadow-xl ring-1 ring-gray-900/5">
        <div class="space-y-2">
            <div class="flex flex-row flex-wrap gap-2">
                <Tag class="font-semibold bg-indigo-600" text={data.part.description}/>
            </div>
            <h2>Part images:</h2>
        </div>
        <div>

            {#each data.partImages as image}
            <ImageThumbnail url={image} />
            {/each}
        </div>
    </div>
{/if}
