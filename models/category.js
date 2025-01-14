const connection = require('../config/db');

const Category = {
    create: async ({ categoryName }) => {
        try {
            const query = `
                INSERT INTO categories (category_name)
                VALUES ($1)
                RETURNING category_id, category_name;
            `;
            const values = [categoryName];
            const result = await connection.query(query, values);
            const newCategory = {
                categoryId: result.rows[0].category_id,
                categoryName: result.rows[0].category_name
            }
            return newCategory;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    categoryExists: async (categoryId) => {
        try {
            const query = `
                SELECT 1
                FROM categories
                WHERE category_id = $1;
            `
            const values = [categoryId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Não pode ser checado essa categoria: ${error.message}`);
        }
    },

    itemExistsInCategory: async (categoryId) => {
        try {
            const query = `
                SELECT 1
                FROM items
                WHERE category_id = $1
                LIMIT 1;
            `;
            const values = [categoryId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Erro ao verificar itens associados: ${error.message}`);
        }
    },

    update: async ({ categoryId, categoryName }) => {
        try {
            const exists = await Category.categoryExists(categoryId);

            if (!exists) {
                throw new Error('Categoria não encontrada.');
            }

            const query = `
                UPDATE categories
                SET category_name = $2
                WHERE category_id = $1
                RETURNING category_id, category_name;
            `;
            const values = [categoryId, categoryName];
            const result = await connection.query(query, values);
            const updateCategory = {
                categoryId: result.rows[0].category_id,
                categoryName: result.rows[0].category_name
            };

            return updateCategory;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT category_id, category_name
                FROM categories
                ORDER BY category_name ASC;
            `;
            const result = await connection.query(query);
            const categories = result.rows.map(category => ({
                categoryId: category.category_id,
                categoryName: category.category_name
            }))
            return categories;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    delete: async ({ categoryId }) => {
        try {
            const exists = await Category.categoryExists(categoryId);

            if (!exists) {
                throw new Error('Categoria não encontrada.');
            }

            const hasItems = await Category.itemExistsInCategory(categoryId);

            if (hasItems) {
                throw new Error('Não é possível excluir a categoria, pois ela está associada a um ou mais itens.');
            }

            const query = `
                DELETE
                FROM categories
                WHERE category_id = $1;
            `
            const values = [categoryId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

module.exports = Category;