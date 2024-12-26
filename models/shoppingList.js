const connection = require('../config/db');

const ShoppingList = {
    create: async ({userId, listName}) => {
        try {
            const query = `
                INSERT INTO shopping_lists (user_id, list_name, created_at)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING list_id, list_name, created_at;
            `;
            const values = [userId, listName];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT list_id, list_name, created_at, completed_at
                FROM shopping_lists;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findByUserId: async ({userId}) => {
        try {
            const query = `
                SELECT list_id, list_name, created_at, completed_at
                FROM shopping_lists
                WHERE user_id = $1;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    update: async ({listId, listName}) => {
        try {
            const query = `
                UPDATE shopping_lists
                SET list_name = $2, updated_at = CURRENT_TIMESTAMP
                WHERE list_id = $1
                RETURNING list_id, list_name;
            `;
            const values = [listId, listName];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    markAsCompleted: async ({listId}) => {
        try {
            const query = `
                UPDATE shopping_lists
                SET completed_at = CURRENT_TIMESTAMP, status = $1, updated_at = CURRENT_TIMESTAMP
                WHERE list_id = $2;
            `;
            const values = ['completed', listId];
            const result = await connection.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    delete: async ({listId}) => {
        try {
            const query = `
                DELETE FROM shopping_lists
                WHERE list_id = $1;
            `;
            const values = [listId];
            const result = await connection.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
}

module.exports = ShoppingList;