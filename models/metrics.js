const connection = require('../config/db');

const Metrics = {
    getTotalSpentByPeriod: async ({startDate, endDate, userId}) => {
        try {
            const query = `
                SELECT SUM(total_amount) as "totalSpent"
                FROM shopping_lists
                WHERE user_id = $1 AND status = 'completed' AND completed_at BETWEEN $2 AND $3;
            `;
            const values = [userId, startDate, endDate];
            const { rows } = await connection.query(query, values);
            return rows[0]?.totalSpent || 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getAverageSpentPerList: async ({userId}) => {
        try {
            const query = `
                SELECT AVG(total_amount) as "averageSpent"
                FROM shopping_lists
                WHERE user_id = $1 AND status = 'completed';
            `;
            const values = [userId];
            const { rows } = await connection.query(query, values);
            return rows[0]?.averageSpentPerList || 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getMostPurchasedItems: async ({ userId, limit = 10}) => {
        try {
            const query = `
                SELECT 
                    i.product_name as "itemName", 
                    SUM(ph.unit_price * ph.quantity) as "totalSpent", 
                    SUM(ph.quantity) as "totalQuantity", 
                    i.item_id as "itemId"
                FROM price_history ph
                JOIN items i ON ph.item_id = i.item_id
                JOIN shopping_lists sl ON ph.user_id = sl.user_id
                WHERE sl.user_id = 1 AND sl.status = 'completed'
                GROUP BY i.product_name, i.item_id
                ORDER BY "totalQuantity" DESC
                LIMIT 3;
            `
            const values = [userId, limit];
            const { rows } = await connection.query(query, values);
            return rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getListsCountByPeriod: async ({ startDate, endDate, userId }) => {
        try {
            const query = `
                SELECT COUNT(list_id) as "listCount"
                FROM shopping_lists
                WHERE user_id = $1 
                AND status = 'completed' 
                AND completed_at BETWEEN $2 AND $3;
            `

            const values = [userId, startDate, endDate];
            const { rows } = await connection.query(query, values);
            return rows[0].listCount || 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getSpendingByCategory: async ({ startDate, endDate, userId }) => {
        try {
            const query = `
                SELECT c.category_name as "categoryName", SUM(si.unit_price * si.quantity) as "totalSpent"
                FROM shopping_items si
                JOIN items i ON si.item_id = i.item_id
                JOIN shopping_lists sl ON si.list_id = sl.list_id
                LEFT JOIN categories c ON i.category_id = c.category_id
                WHERE sl.user_id = $1 
                AND sl.status = 'completed'
                AND sl.completed_at BETWEEN $2 AND $3
                GROUP BY c.category_name;
            `;
            const values = [userId, startDate, endDate];
            const { rows } = await connection.query(query, values);
            return rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    
    
}

module.exports = Metrics;