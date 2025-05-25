const connection = require('../config/db');

const Market = {
    create: async (marketName) => {
        try {
            const query = `
            INSERT INTO markets (name)
            VALUES ($1)
            RETURNING id as "marketId", name as "marketName"
            `;
            const values = [marketName.trim().toUpperCase()];
            const result = await connection.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar mercado: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT  id AS "marketId", 
                        name AS "marketName",
                        created_at AS "createAt"
                FROM markets
                ORDER BY name;
            `;
            const result = await connection.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar mercados: ${error.message}`);
        }
    },

    update: async (marketId, newName) => {
        try {
            const query = `
                UPDATE markets
                SET name = $1
                WHERE id = $2
                RETURNING id AS "marketId", name AS "marketName", created_at AS "createdAt"
            `;
            const values = [newName.trim().toUpperCase(), marketId];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error('Mercado não encontrado para atualização.');
            }

            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar mercado: ${error.message}`);
        }
    },

    delete: async (marketId) => {
        try {
            const query = `
                DELETE FROM markets
                WHERE id = $1
                RETURNING id AS "marketId", name AS "marketName"
            `;
            const values = [marketId];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error('Mercado não encontrado para exclusão.');
            }
        } catch (error) {
            throw new Error(`Erro ao deletar mercado: ${error.message}`);
        }
    }
}

module.exports = Market;