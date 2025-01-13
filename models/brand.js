const connection = require('../config/db');

const Brand = {
    create: async ({ brandName }) => {
        try {
            const query = `
                INSERT INTO brands (brand_name)
                VALUES ($1)
                RETURNING brand_id, brand_name;
            `;
            const values = [brandName];
            const result = await connection.query(query, values);
            const newBrand = {
                brandId: result.rows[0].brand_id,
                brandName: result.rows[0].brand_name
            };

            return newBrand;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    brandExists: async (brandId) => {
        try {
            const query = `
                SELECT 1
                FROM brands
                WHERE brand_id = $1;
            `
            const values = [brandId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Não pode ser checado essa marca: ${error.message}`);
        }
    },

    update: async ({ brandId, brandName }) => {
        try {
            const exists = await Brand.brandExists(brandId);

            if (!exists) {
                throw new Error('Marca não encontrada.');
            }

            const query = `
                UPDATE brands
                SET brand_name = $2
                WHERE brand_id = $1
                RETURNING brand_id, brand_name;
            `;
            const values = [brandId, brandName];
            const result = await connection.query(query, values);
            const updatedBrand = {
                brandId: result.rows[0].brand_id,
                brandName: result.rows[0].brand_name
            };

            return updatedBrand;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT brand_id, brand_name
                FROM brands
                ORDER BY brand_name ASC;
            `;
            const result = await connection.query(query);
            const brands = result.rows.map(brand => ({
                brandId: brand.brand_id,
                brandName: brand.brand_name,
            }))
            return brands;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    delete: async ({ brandId }) => {
        try {
            const exists = await Brand.brandExists(brandId);

            if (!exists) {
                throw new Error('Marca não encontrada.');
            }

            const query = `
                DELETE
                FROM brands
                WHERE brand_id = $1;
            `;
            const values = [brandId];
            const result = await connection.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

}

module.exports = Brand;