const connection = require('../config/db');

const Unit = {
    create: async (unitName) => {
        const query = `
            INSERT INTO units (name)
            VALUES ($1)
            RETURNING id as "unitId", name as "unitName";
        `;
        const values = [unitName];
        const result = await connection.query(query, values);
        return result.rows[0];
    },


    findAll: async () => {
        const query = `
            SELECT id as "unitId", name as "unitName"
            FROM units
            ORDER BY name ASC;
        `;
        const result = await connection.query(query);
        return result.rows;
    },

    findById: async (unitId) => {
        const query = `
            SELECT id as "unitId", name as "unitName"
            FROM units
            WHERE id = $1;
        `;
        const values = [unitId];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    update: async (unitId, unitName) => {
        const query = `
            UPDATE units
            SET name = $2
            WHERE id = $1
            RETURNING id as "unitId", name as "unitName";
        `;
        const values = [unitId, unitName];
        const result = await connection.query(query, values);
        return result.rows[0];
    },


    delete: async (unitId) => {
        try {
            const query = `
                DELETE FROM units
                WHERE id = $1;
            `;
            const values = [unitId];
            await connection.query(query, values);
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

module.exports = Unit;