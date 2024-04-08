import { list } from '@vercel/blob';

import { connect } from '$lib/database/connection';
import { getAllContracts } from '$lib/database/contract';
import { getContractParts } from '$lib/database/contractPart';
import { getPart } from '$lib/database/part';

import type { PageServerLoad } from './$types';

const normalize = (s: string) => s.toUpperCase().replace(/\W+/g, '_');

export const load = (async ({ params }) => {
    const partId = parseInt(params.id);
    const connection = connect();
    const [part, contractParts, contracts] = await Promise.all([
        getPart(partId, connection),
        getContractParts(partId, connection),
        getAllContracts(connection)
    ]);

    const { blobs: sectionImages } = await list({
        mode: 'folded',
        prefix: `sections/${normalize(part.section)}/`
    });
    const { blobs: subSectionImages } = await list({
        mode: 'folded',
        prefix: `sections/${normalize(part.section)}/${normalize(part.subsection)}/`
    });
    const { blobs: partImages } = await list({
        mode: 'folded',
        prefix: `sections/${normalize(part.section)}/${normalize(part.subsection)}/${String(part.id).padStart(4, '0')}/`
    });

    return {
        part,
        contractParts,
        contracts,
        sectionImages: sectionImages.map((blob) => blob.url),
        subSectionImages: subSectionImages.map((blob) => blob.url),
        partImages: partImages.map((blob) => blob.url)
    };
}) satisfies PageServerLoad;
