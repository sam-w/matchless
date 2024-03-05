import { connect } from './connection';
import type { Part } from './part';

export type SearchResult = Part & {
    contract_number: string;
    part_number: string;
};

type Terms = {
    partName?: string;
    partNumber?: string;
    contract?: string;
}

export const search = async (
    terms: Terms,
    connection = connect()
) => {
    const startTime = Date.now();

    const sanitizedTerms = sanitizeTerms(terms);

    const whereClauses = [
        ...(sanitizedTerms.partName?.length
            ? [
                sanitizedTerms.partName
                      .map(
                          (term) =>
                              `(section ILIKE '%${term}%' OR subsection ILIKE '%${term}%' OR description ILIKE '%${term}%')`
                      )
                      .join(' AND ')
              ]
            : []),
        ...(sanitizedTerms.partNumber?.length
            ? [sanitizedTerms.partNumber.map((term) => `part_number ILIKE '%${term}%'`).join(' AND ')]
            : []),
        ...(sanitizedTerms.contract?.length
            ? [sanitizedTerms.contract.map((term) => `contract_number ILIKE '%${term}%'`).join(' AND ')]
            : [])
    ].join(' AND ');

    const { rows } = await connection.query(`
        SELECT part.id, part.section, part.subsection, part.description, part.quantity, contract.contract_number, part_number FROM contract_part
        JOIN part ON part.id = contract_part.part
        JOIN contract ON contract.id = contract_part.contract
        WHERE ${whereClauses}
        ORDER BY part.id, contract.id;
    `);
    return {
        whereClauses,
        count: rows.length,
        groups: (rows as SearchResult[]).reduce(
            (acc, row) => {
                return {
                    ...acc,
                    [row.id]: [...(acc[row.id] || []), row]
                };
            },
            {} as { [key: number]: SearchResult[] }
        ),
        duration: Date.now() - startTime
    };
};

const sanitizeTerms = (terms: Terms) => ({
    partName: sanitize(terms.partName),
    partNumber: sanitize(terms.partNumber),
    contract: sanitize(terms.contract)  
})

const sanitize = (term: string | undefined) => term?.split(/\W+/).map((t) => t.replace(/\W+/, ''));