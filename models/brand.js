const connection = require('../config/db');

const Brand = {
    create: async (brandName) => {
        try {
            const brandExistsQuery = `
                SELECT 1
                FROM brands
                WHERE name = $1;
            `;
            const brandExistsResult = await connection.query(brandExistsQuery, [brandName]);

            if (brandExistsResult.rowCount > 0) {
                throw new Error('Marca já existente.');
            }

            const query = `
                INSERT INTO brands (name)
                VALUES ($1)
                RETURNING id as "brandId", name as "brandName";
            `;
            const values = [brandName];
            const result = await connection.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    brandExists: async (brandId) => {
        try {
            const query = `
                SELECT 1
                FROM brands
                WHERE id = $1;
            `
            const values = [brandId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    itemExistsInBrand: async (brandId) => {
        try {
            const query = `
                SELECT 1
                FROM items
                WHERE brand_id = $1;
            `
            const values = [brandId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async (brandId, brandName) => {
        try {
            const exists = await Brand.brandExists(brandId);

            if (!exists) {
                throw new Error('Marca não encontrada.');
            }

            const query = `
                UPDATE brands
                SET name = $2
                WHERE id = $1
                RETURNING id as "brandId", name as "brandName";
            `;
            const values = [brandId, brandName];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT id as "brandId", name as "brandName"
                FROM brands
                ORDER BY name ASC;
            `;
            const result = await connection.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    delete: async (brandId) => {
        try {
            const exists = await Brand.brandExists(brandId);

            if (!exists) {
                throw new Error('Marca não encontrada.');
            }

            const hasItems = await Brand.itemExistsInBrand(brandId);

            if (hasItems) {
                throw new Error('Não é possível excluir a marca, pois ela está associada a um ou mais itens.');
            };

            const query = `
                DELETE
                FROM brands
                WHERE id = $1;
            `;
            const values = [brandId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

}

module.exports = Brand;