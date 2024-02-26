import { createPool } from '@vercel/postgres';

import { POSTGRES_URL } from '$env/static/private';

import type { DatabaseRow } from '$lib/database/DatabaseRow';

export const runQuery = async (terms: {
    partName: string[];
    partNumber: string[];
    contract: string[];
}) => {
    const db = createPool({ connectionString: POSTGRES_URL });
    const startTime = Date.now();

    const whereClauses = [
        ...(terms.partName.length
            ? [
                  terms.partName
                      .map(
                          (term) =>
                              `(section ILIKE '%${term}%' OR subsection ILIKE '%${term}%' OR description ILIKE '%${term}%')`
                      )
                      .join(' AND ')
              ]
            : []),
        ...(terms.partNumber.length
            ? [terms.partNumber.map((term) => `part_number ILIKE '%${term}%'`).join(' AND ')]
            : []),
        ...(terms.contract.length
            ? [terms.contract.map((term) => `contract_number ILIKE '%${term}%'`).join(' AND ')]
            : [])
    ].join(' AND ');

    const { rows } = await db.query(`
        SELECT part.section, part.subsection, part.description, part.quantity, contract.contract_number, part_number FROM contract_part
        JOIN part ON part.id = contract_part.part
        JOIN contract ON contract.id = contract_part.contract
        WHERE ${whereClauses}
        ORDER BY part.id, contract.id;
    `);
    const key = (row: DatabaseRow) => `${row.section}-${row.subsection}-${row.description}`;
    const groups = (rows as DatabaseRow[]).reduce(
        (acc, row) => {
            return {
                ...acc,
                [key(row)]: [...(acc[key(row)] || []), row]
            };
        },
        {} as { [key: string]: DatabaseRow[] }
    );
    const duration = Date.now() - startTime;
    return {
        whereClauses,
        count: rows.length,
        groups,
        duration
    };
};
