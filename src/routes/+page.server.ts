import { createPool } from '@vercel/postgres'
import { POSTGRES_URL } from '$env/static/private'

import type { Actions } from './$types'
import type { DatabaseRow } from '$lib/DatabaseRow'

const runQuery = async (terms: {
  partName: string[];
  partNumber: string[];
  contract: string[];
}) => {
  const db = createPool({ connectionString: POSTGRES_URL })
  const startTime = Date.now()

  const whereClauses = [
    ...(terms.partName.length ? [terms.partName.map((term) => `(section ILIKE '%${term}%' OR subsection ILIKE '%${term}%' OR description ILIKE '%${term}%')`).join(' AND ')] : []),
    ...(terms.partNumber.length ? [terms.partNumber.map((term) => `part_number ILIKE '%${term}%'`).join(' AND ')] : []),
    ...(terms.contract.length ? [terms.contract.map((term) => `contract_number ILIKE '%${term}%'`).join(' AND ')] : [])
  ].join(' AND ')

  console.log(whereClauses)

  const { rows } = await db.query(`
    SELECT part.section, part.subsection, part.description, part.quantity, contract.contract_number, part_number FROM contract_part
    JOIN part ON part.id = contract_part.part
    JOIN contract ON contract.id = contract_part.contract
    WHERE ${whereClauses}
    ORDER BY section, subsection, description, contract.id;
  `)
  const key = (row: DatabaseRow) => `${row.section}-${row.subsection}-${row.description}`
  const grouped = (rows as DatabaseRow[]).reduce((acc, row) => {
    return {
      ...acc,
      [key(row)]: [...(acc[key(row)] || []), row]
    }
  }, {} as { [key: string]: DatabaseRow[] })
  const duration = Date.now() - startTime
  return {
    whereClauses,
    resultCount: rows.length,
    grouped,
    duration,
  }
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const partNameQuery = data.get('part_name')!.toString();
    const partNumberQuery = data.get('part_number')!.toString();
    const contractQuery = data.get('contract')!.toString();
    return runQuery({
      partName: partNameQuery ? partNameQuery.split(/\W+/) : [],
      partNumber: partNumberQuery ? partNumberQuery.split(/\W+/) : [],
      contract: contractQuery ? contractQuery.split(/\W+/) : [],
   });
  }
} satisfies Actions;