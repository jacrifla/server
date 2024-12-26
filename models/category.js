const connection = require('../config/db');

const Category = {
    create: async ({ category_name }) => {
        try {
            const query = `
                INSERT INTO categories (category_name)
                VALUES ($1)
                RETURNING category_id, category_name;
            `;
            const values = [category_name];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT category_id, category_name
                FROM categories;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    update: async ({ category_id, category_name }) => {
        try {
            const query = `
                UPDATE categories
                SET category_name = $2
                WHERE category_id = $1
                RETURNING category_id, category_name;
            `;
            const values = [category_id, category_name];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
}

module.exports = Category;