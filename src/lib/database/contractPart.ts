import { connect } from './connection';

export type ContractPart = {
    part_number: string;
    contract_id: number;
};

export const getContractParts = async (partId: number, connection = connect()) => {
    const { rows } = await connection.sql`
        SELECT part_number, contract as contract_id
        FROM contract_part
        WHERE part = ${partId}
        ORDER BY contract;
    `;
    return rows as ContractPart[];
};
