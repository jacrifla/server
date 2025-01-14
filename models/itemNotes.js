const connection = require('../config/db');

const ItemNotesModel = {
    createNote: async ({ userId, itemId, note }) => {
        try {
            if (!note || !userId) {
                throw new Error("Nota ou usuário não fornecidos.");
            }

            const query = `
                INSERT INTO item_notes (user_id, item_id, note)
                VALUES ($1, $2, $3)
                RETURNING note_id, user_id, item_id, note, created_at;
            `;
            const values = [userId, itemId, note];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    getNotes: async (itemId) => {
        try {
            const query = `
                SELECT * FROM item_notes
                WHERE item_id = $1
                ORDER BY created_at DESC;
            `;
            const { rows } = await connection.query(query, [itemId]);
            return rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    updateNote: async ({ note, userId, itemId }) => {
        try {
            const query = `
                UPDATE item_notes
                SET note = $1
                WHERE user_id = $2 AND item_id = $3
                RETURNING note;
            `;
            const values = [note, userId, itemId];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar a anotação: ${error.message}`);
        }
    },
};

module.exports = ItemNotesModel;
