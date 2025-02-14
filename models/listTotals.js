const connection = require('../config/db');

const ListTotals = {
    create: async (listId, userId, total, purchaseDate) => {
        try {
            const query = `
                INSERT INTO list_totals (list_id, user_id, total, purchase_date)
                VALUES ($1, $2, $3, $4)
                RETURNING id as "listTotalId", list_id as "listId", user_id as "userId", total as "total", purchase_date as "purchaseDate";
            `;
            const values = [listId, userId, total, purchaseDate];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = ListTotals;