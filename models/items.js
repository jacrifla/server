const connection = require('../config/db');

const Items = {
    createItem: async (name, categoryId, brandId, barcode, unitId, userId) => {
        try {
            const query = `
                INSERT INTO items (name, category_id, brand_id, barcode, unit_id, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING 
                    id as "itemId", 
                    name as "itemName", 
                    category_id as "categoryId", 
                    brand_id as "brandId", 
                    unit_id as "unitId",
                    barcode,
                    created_at as "createdAt",
                    user_id as "userId";
            `;
            const values = [name, categoryId, brandId, barcode, unitId, userId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao adicionar item: ' + error.message);
        }
    },

    itemExists: async (itemId) => {
        try {
            const query = `
                SELECT 1
                FROM items
                WHERE item_id = $1;
            `;
            const values = [itemId];
            const result = await connection.query(query, values);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    updateItem: async (itemId, name, categoryId, brandId, barcode, unitId, updatedBy) => {
        try {
            const userCheck = await connection.query(
                "SELECT id FROM users WHERE id = $1",
                [updatedBy]
            );
            if (userCheck.rows.length === 0) {
                throw new Error("Usuário que atualiza não existe.");
            }

            const query = `
                UPDATE items
                SET name = COALESCE($2, name),
                    category_id = COALESCE($3, category_id),
                    brand_id = COALESCE($4, brand_id),
                    barcode = COALESCE($5, barcode),
                    unit_id = COALESCE($6, unit_id),
                    updated_at = CURRENT_TIMESTAMP,
                    updated_by = $7
                WHERE id = $1
                RETURNING id as "itemId", 
                    name as "itemName", 
                    category_id as "categoryId", 
                    brand_id as "brandId",
                    unit_id as "unitId",
                    barcode,
                    updated_at as "updatedAt",
                    user_id as "userId",
                    updated_by as "updatedBy";
            `;
            const values = [itemId, name, categoryId, brandId, barcode, unitId, updatedBy];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao atualizar item: ' + error.message);
        }
    },

    deleteItem: async (itemId) => {
        try {
            const query = `
                UPDATE items
                SET deleted_at = NOW()
                WHERE id = $1 AND deleted_at IS NULL
                RETURNING id AS "itemId";
            `;
            const values = [itemId];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error(`Item com id ${itemId} não encontrado ou já deletado.`);
            }

            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao deletar item: ' + error.message);
        }
    },

    getItemById: async (id) => {
        const query = `
            SELECT
                i.id as "itemId",
                i.name as "itemName",
                i.barcode::BIGINT as barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId",
                u.name as "unitName",
                i.unit_id as "unitId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            LEFT JOIN units u ON i.unit_id = u.id
            WHERE i.id = $1 AND i.deleted_at IS NULL;
        `;
        const values = [id];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getItemByName: async (name) => {
        const query = `
            SELECT
                i.id as "itemId",
                i.name as "itemName",
                i.barcode::BIGINT as barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId",
                u.name as "unitName",
                i.unit_id as "unitId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            LEFT JOIN units u ON i.unit_id = u.id
            WHERE i.name ILIKE $1 AND i.deleted_at IS NULL;
        `;
        const values = [`%${name}%`];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getItemByBarcode: async (barcode) => {
        const query = `
           SELECT
                i.id as "itemId",
                i.name as "itemName",
                i.barcode::BIGINT as barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId",
                u.name as "unitName",
                i.unit_id as "unitId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            LEFT JOIN units u ON i.unit_id = u.id
            WHERE i.barcode = $1 AND i.deleted_at IS NULL;
        `;
        const values = [barcode];
        const result = await connection.query(query, values);

        return result.rows;
    },

    getAllItems: async () => {
        const query = `
            SELECT 
                i.id as "itemId",
                i.name as "itemName",
                i.barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId",
                u.name as "unitName",
                i.unit_id as "unitId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            LEFT JOIN units u ON i.unit_id = u.id
            WHERE i.deleted_at IS NULL
            ORDER BY i.name;
        `;
        const result = await connection.query(query);
        return result.rows;
    },

    restoreItem: async (itemId) => {
        try {
            const query = `
                UPDATE items
                SET deleted_at = NULL
                WHERE id = $1 AND deleted_at IS NOT NULL
                RETURNING id AS "itemId";
            `;
            const values = [itemId];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error(`Item com id ${itemId} não foi encontrado ou já está ativo.`);
            }

            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao restaurar item: ' + error.message);
        }
    },
}

module.exports = Items;
