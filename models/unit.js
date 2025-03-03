const connection = require('../config/db');

const Unit = {
    create: async (unitAbbreviation) => {
        try {
            const query = `
                INSERT INTO units (abbreviation)
                VALUES ($1)
                RETURNING id as "unitId", abbreviation as "unitAbbreviation";
            `
            const values = [unitAbbreviation];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT id as "unitId", abbreviation as "unitAbbreviation"
                FROM units
                ORDER BY abbreviation ASC;
            `
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findById: async (unitId) => {
        try {
            const query = `
                SELECT id as "unitId", abbreviation as "unitAbbreviation"
                FROM units
                WHERE id = $1;
            `;
            const values = [unitId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async (unitId, unitAbbreviation) => {
        try {
            const query = `
                UPDATE units
                SET abbreviation = $2
                WHERE id = $1
                RETURNING id as "unitId", abbreviation as "unitAbbreviation";
            `;
            const values = [unitId, unitAbbreviation];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
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