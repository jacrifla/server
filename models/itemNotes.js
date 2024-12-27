const connection = require('../config/db');

const ItemNotesModel = {
    createNote: async ({ user_id, item_id, note }) => {
        try {
            const query = `
                INSERT INTO item_notes (user_id, item_id, note)
                VALUES ($1, $2, $3)
                RETURNING note_id, user_id, item_id, note, created_at;
            `;
            const values = [user_id, item_id, note];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    getNotes: async (item_id) => {
        try {
            const query = `
                SELECT * FROM item_notes
                WHERE item_id = $1
                ORDER BY created_at DESC;
            `;
            const { rows } = await connection.query(query, [item_id]);
            return rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    updateNote: async ({ note_id, note }) => {
        try {
            const query = `
                UPDATE item_notes
                SET note = $1
                WHERE note_id = $2
                RETURNING note_id, user_id, item_id, note, created_at;
            `;
            const values = [note, note_id];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar a anotação: ${error.message}`);
        }
    },
};

module.exports = ItemNotesModel;