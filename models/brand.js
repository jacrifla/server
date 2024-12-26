const connection = require('../config/db');

const Brand = {
    create: async ({brand_name}) => {
        try {
            const query = `
                INSERT INTO brands (brand_name)
                VALUES ($1)
                RETURNING brand_id, brand_name;
            `;
            const values = [brand_name];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    update: async ({brand_id, brand_name}) => {
        try {
            const query = `
                UPDATE brands
                SET brand_name = $2
                WHERE brand_id = $1
                RETURNING brand_id, brand_name;
            `;
            const values = [brand_id, brand_name];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT brand_id, brand_name
                FROM brands;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`);
        }
    },

}

module.exports = Brand;