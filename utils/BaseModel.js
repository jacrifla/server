const connection = require('../config/db');

class BaseModel {
    constructor(tableName, fields, options = {}) {
        this.table = tableName;
        this.fields = fields;
        this.labelMap = options.labelMap || {};
        this.extraValidation = options.extraValidation || null;
    }

    async recordExists(field, value) {
        const query = `SELECT 1 FROM ${this.table} WHERE ${field} = $1`;
        const result = await connection.query(query, [value.trim?.() || value]);
        return result.rowCount > 0;
    }

    async create(data) {
        if (this.extraValidation) {
            await this.extraValidation(data);
        }

        const placeholders = this.fields.map((_, i) => `$${i + 1}`).join(', ');
        const query = `
            INSERT INTO ${this.table} (${this.fields.join(', ')})
            VALUES (${placeholders})
            RETURNING ${this.getAliasedFields().join(', ')};
        `;

        const values = this.fields.map((f) => {
            const val = data[f];
            return typeof val === 'string' ? val.trim() : val;
        });

        const result = await connection.query(query, values);
        return result.rows[0];
    }

    async update(id, data) {
        const setClause = this.fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
        const values = [id, ...this.fields.map((f) =>
            typeof data[f] === 'string' ? data[f].trim() : data[f]
        )];

        const query = `
            UPDATE ${this.table}
            SET ${setClause}
            WHERE id = $1
            RETURNING ${this.getAliasedFields().join(', ')};
        `;

        const result = await connection.query(query, values);
        if (result.rowCount === 0) throw new Error(`${this.table} não encontrada.`);
        return result.rows[0];
    }

    async delete(id, options = {}) {
        if (options.checkDependency) {
            const depQuery = `SELECT 1 FROM ${options.depTable} WHERE ${options.depField} = $1`;
            const depResult = await connection.query(depQuery, [id]);
            if (depResult.rowCount > 0) {
                throw new Error(options.depError || 'Registro possui dependências e não pode ser excluído.');
            }
        }

        const query = `DELETE FROM ${this.table} WHERE id = $1`;
        const result = await connection.query(query, [id]);
        return result.rowCount > 0;
    }

    async findAll() {
        const orderField = this.fields.includes('name') ? 'name' : this.fields[0];
        const query = `
            SELECT ${this.getAliasedFields().join(', ')}
            FROM ${this.table}
            ORDER BY ${orderField} ASC;
        `;
        const result = await connection.query(query);
        return result.rows;
    }

    getAliasedFields() {
        return ['id', ...this.fields].map(
            (f) => `${f === 'id' ? 'id' : f} AS "${this.labelMap[f] || f}"`
        );
    }
}

module.exports = BaseModel;
