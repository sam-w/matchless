import { connect } from './connection';

export type Contract = {
    id: number;
    contract_number: string;
};

export const getAllContracts = async (connection = connect()) => {
    const { rows } = await connection.sql`
        SELECT id, contract_number
        FROM contract
        ORDER BY id;
    `;
    return rows as Contract[];
};
