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

    categoryExists: async (category_id) => {
        try {
            const query = `
                SELECT 1
                FROM categories
                WHERE category_id = $1;
            `
            const values = [category_id];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Não pode ser checado essa categoria: ${error.message}`);
        }
    },

    update: async ({ category_id, category_name }) => {
        try {
            const exists = await Category.categoryExists(category_id);

            if (!exists) {
                throw new Error('Categoria não encontrada.');
            }

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