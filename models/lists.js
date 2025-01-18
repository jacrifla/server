const connection = require('../config/db');

const List = {
    create: async ( userId, listName ) => {
        try {
            const query = `
                INSERT INTO lists (user_id, name, created_at)
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING id as "listId", user_id as "userId", name as "listName", created_at as "createdAt";
            `;
            const values = [userId, listName];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT 
                    id as "listId", 
                    user_id as "userId",
                    name as "listName", 
                    created_at as "createdAt", 
                    completed_at as "completedAt",
                    total_amount::float as "totalAmount"
                FROM lists
                ORDER BY id, created_at DESC;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findByUserId: async ( userId ) => {
        try {
            const query = `
                SELECT 
                    L.ID AS "listId",
                    L.NAME AS "listName",
                    L.CREATED_AT AS "createdAt",
                    L.UPDATED_AT AS "updatedAt",
                    L.COMPLETED_AT AS "completedAt",
                    L.total_amount::float as "totalAmount",
                    L.USER_ID AS "ownerUserId",
                    SL.SHARED_USER_ID AS "sharedWithUserId"
                FROM 
                    LISTS L
                LEFT JOIN 
                    SHARED_LISTS SL ON L.ID = SL.LIST_ID
                WHERE 
                    L.USER_ID = $1
                    OR SL.SHARED_USER_ID = $1;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async ( listId, listName ) => {
        try {
            const query = `
                UPDATE lists
                SET name = $2, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id as "listId", name as "listName";
            `;
            const values = [listId, listName];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    markAsCompleted: async ( listId, totalAmount ) => {
        try {
            const query = `
                UPDATE lists
                SET completed_at = CURRENT_TIMESTAMP,
                    total_amount = $1
                WHERE id = $2
                RETURNING 
                    id as "listId", 
                    name as "listName", 
                    total_amount::float as "totalAmount", 
                    completed_at as "completedAt";
            `;
            const values = [totalAmount, listId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    delete: async ( listId ) => {
        try {
            const query = `
                DELETE FROM lists
                WHERE id = $1;
            `;
            const values = [listId];
            const result = await connection.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },
};

module.exports = List;
