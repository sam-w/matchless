import { error } from '@sveltejs/kit';
import { connect } from './connection';

export type Part = {
    id: number;
    section: string;
    subsection: string;
    description: string;
    quantity: string;
};

export const getPart = async (id: number, connection = connect()) => {
    const { rows } = await connection.sql`
        SELECT * FROM part
        WHERE id = ${id}
    `;
    if (!rows.length) {
        error(404, `No part with id ${id}`);
    }
    return rows[0] as Part;
};