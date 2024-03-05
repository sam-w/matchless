import { search } from '$lib/database/search';

import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const partName = (data.get('part_name') as string) || undefined;
        const partNumber = (data.get('part_number') as string) || undefined;
        const contract = (data.get('contract') as string) || undefined;
        if (!partName && !partNumber && !contract) {
            return {
                error: 'Please enter at least one search term'
            };
        }
        return {
            results: await search({
                partName,
                partNumber,
                contract
            })
        };
    }
} satisfies Actions;
