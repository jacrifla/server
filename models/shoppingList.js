const connection = require('../config/db');

const ShoppingList = {
    create: async ({ userId, listName }) => {
        try {
            const query = `
                INSERT INTO shopping_lists (user_id, list_name, created_at)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING list_id, list_name, created_at;
            `;
            const values = [userId, listName];
            const result = await connection.query(query, values);
            const { list_id, list_name, created_at } = result.rows[0];
            return {
                listId: list_id,
                listName: list_name,
                createdAt: created_at,
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT list_id, list_name, created_at, completed_at
                FROM shopping_lists;
            `;
            const result = await connection.query(query);
            return result.rows.map((row) => ({
                listId: row.list_id,
                listName: row.list_name,
                createdAt: row.created_at,
                completedAt: row.completed_at,
            }));
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findByUserId: async ({ userId }) => {
        try {
            const query = `
                SELECT DISTINCT ON (shopping_lists.list_id) 
                    shopping_lists.list_id, 
                    shopping_lists.list_name, 
                    shopping_lists.created_at, 
                    shopping_lists.completed_at,
                    shopping_lists.user_id, 
                    shared_list.user_id AS shared_user_id, 
                    shared_list.permission AS shared_permission,
                    shared_list.shared_at
                FROM shopping_lists
                LEFT JOIN shared_list 
                    ON shopping_lists.list_id = shared_list.list_id
                WHERE shopping_lists.user_id = $1
                    OR (shared_list.user_id = $1 AND shared_list.permission = TRUE)
                ORDER BY shopping_lists.list_id, shopping_lists.created_at DESC;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
                        
            return result.rows.map((row) => ({
                userId: row.user_id,
                listId: row.list_id,
                listName: row.list_name,
                createdAt: row.created_at,
                completedAt: row.completed_at,
                sharedUserId: row.shared_user_id,
                sharedPermission: row.shared_permission,
                sharedAt: row.shared_at,
            }));
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async ({ listId, listName }) => {
        try {
            const query = `
                UPDATE shopping_lists
                SET list_name = $2, updated_at = CURRENT_TIMESTAMP
                WHERE list_id = $1
                RETURNING list_id, list_name;
            `;
            const values = [listId, listName];
            const result = await connection.query(query, values);
            const { list_id, list_name } = result.rows[0];
            return {
                listId: list_id,
                listName: list_name,
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    markAsCompleted: async ({ listId }) => {
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
            throw new Error(`${error.message}`);
        }
    },

    delete: async ({ listId }) => {
        try {
            const query = `
                DELETE FROM shopping_lists
                WHERE list_id = $1;
            `;
            const values = [listId];
            const result = await connection.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },
};

module.exports = ShoppingList;
