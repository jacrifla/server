const connection = require('../config/db');

const SharedListModel = {
    grantPermission: async ({listId, userId}) => {
        try {
            const query = `
                INSERT INTO shared_list (list_id, user_id, permission)
                VALUES ($1, $2, true)
                RETURNING *;
            `;
            const values = [listId, userId];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    
    getSharedLists: async (user_id) => {
        try {
            const query = `
                SELECT * FROM shared_list
                WHERE user_id = $1;
            `;
            const { rows } = await connection.query(query, [user_id]);
            return rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    deleteSharedList: async ({ shared_list_id }) => {
        try {
            const query = `
                DELETE FROM shared_list
                WHERE shared_list_id = $1
                RETURNING shared_list_id, list_id, user_id, permission, shared_at;
            `;
            const { rows } = await connection.query(query, [shared_list_id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Erro ao deletar o compartilhamento: ${error.message}`);
        }
    },
};

module.exports = SharedListModel;
