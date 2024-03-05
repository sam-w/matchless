import { connect } from '$lib/database/connection';
import { getAllContracts } from '$lib/database/contract';
import { getContractParts } from '$lib/database/contractPart';
import { getPart } from '$lib/database/part';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const partId = parseInt(params.id);
    const connection = connect();
    const [part, contractParts, contracts] = await Promise.all([
        getPart(partId, connection),
        getContractParts(partId, connection),
        getAllContracts(connection)
    ]);
    return {
        part,
        contractParts,
        contracts
    };
}) satisfies PageServerLoad;
