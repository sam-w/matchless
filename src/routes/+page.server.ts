import { runQuery } from '$lib/database/query';

import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const partNameQuery = data.get('part_name') as string;
        const partNumberQuery = data.get('part_number') as string;
        const contractQuery = data.get('contract') as string;
        if (!partNameQuery && !partNumberQuery && !contractQuery) {
            return {
                error: 'Please enter at least one search term'
            };
        }
        return {
            results: await runQuery({
                partName: partNameQuery ? partNameQuery.split(/\W+/) : [],
                partNumber: partNumberQuery ? partNumberQuery.split(/\W+/) : [],
                contract: contractQuery ? contractQuery.split(/\W+/) : []
            })
        };
    }
} satisfies Actions;
