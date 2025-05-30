const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const SALT_ROUND = 10;

const User = {
    createUser: async (name, email, password) => {
        try {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUND);
            const query = `
                INSERT INTO users (name, email, password, created_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING id as "userId", name, email, created_at as "createdAt";
            `
            const values = [name, email.toLowerCase(), hashedPassword];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findByEmail: async (email) => {

        try {
            const query = `
                SELECT 
                    id as "userId", 
                    email, name, 
                    created_at as "createdAt",
                    deleted_at as "deletedAt"
                FROM users
                WHERE LOWER(email) = LOWER($1)
                AND deleted_at IS NULL;
            `;

            const values = [email];
            const result = await connection.query(query, values);

            return result.rows[0];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    findById: async (userId) => {
        try {
            const query = `
                SELECT id as "userId", email, name, created_at as "createdAt"
                FROM users
                WHERE id = $1 AND deleted_at IS NULL;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
            return result.rows[0];

        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async (userId, name, email) => {
        console.log(`userId: ${userId}, name: ${name}, email: ${email}`)
        try {
            const result = await connection.query('SELECT name, email FROM users WHERE id = $1', [userId]);

            if (result.rows.length === 0) {
                throw new Error('Usuário não encontrado.');
            }

            const currentUser = result.rows[0];
            const fields = [];
            const values = [];
            let index = 2;

            if (name !== null && name.trim() !== '' && name !== currentUser.name) {
                fields.push(`name = $${index++}`);
                values.push(name.trim());
            }

            if (email !== null && email.trim() !== '' && email.toLowerCase() !== currentUser.email) {
                fields.push(`email = $${index++}`);
                values.push(email.toLowerCase().trim());
            }

            if (fields.length === 0) {
                throw new Error('Nenhuma alteração foi feita.');
            }

            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.unshift(userId);

            const updateQuery = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $1
            RETURNING id as "userId", name, email, created_at as "createdAt", updated_at as "updatedAt";
        `;

            const updated = await connection.query(updateQuery, values);
            return updated.rows[0];

        } catch (error) {
            throw new Error(error.message);
        }
    },

    delete: async (userId) => {
        try {
            const query = `
                UPDATE users
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE id = $1 AND deleted_at IS NULL;
            `

            const values = [userId];
            const result = await connection.query(query, values);

            return result.rowCount;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    restore: async (email) => {
        try {
            const query = `
                UPDATE users
                SET deleted_at = NULL
                WHERE email = $1 AND deleted_at IS NOT NULL;
            `;
            const values = [email];
            const result = await connection.query(query, values);
            return result.rowCount;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    verifyPassword: async (password, storedPassword) => {
        try {
            const isMatch = await bcrypt.compare(password, storedPassword);
            if (!isMatch) {
                throw new Error('Senha inválida');
            };
            return isMatch;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    generateToken: (userId) => {
        const payload = { userId };
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
        return token;
    },

    login: async (email, password) => {
        try {
            const query = `
                SELECT id as "userId", name, email, password
                FROM users
                WHERE email = $1 AND deleted_at IS NULL;
            `;
            const values = [email];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error('Usuário não encontrado');
            }

            const user = result.rows[0];
            await User.verifyPassword(password, user.password);

            delete user.password;

            const token = User.generateToken(user.user_id);
            return { user, token };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    resetPassword: async (email, newPassword) => {
        try {
            const getPassword = `
                SELECT password
                FROM users
                WHERE email = $1 AND deleted_at IS NULL;
            `;
            const result = await connection.query(getPassword, [email]);

            if (result.rowCount === 0) {
                throw new Error('Usuário não encontrado');
            }

            const storedPassword = result.rows[0].password;

            const match = await bcrypt.compare(newPassword, storedPassword);

            if (match) {
                throw new Error('Nova senha não pode ser a mesma que a anterior');
            }

            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUND);

            const updatePassword = `
                UPDATE users
                SET password = $1
                WHERE email = $2 AND deleted_at IS NULL;
            `;
            const values = [hashedPassword, email];
            const resultUpdate = await connection.query(updatePassword, values);

            return resultUpdate.rowCount;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getAllUsers: async () => {
        try {
            const query = `
                SELECT id as "userId", email, name, created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
                FROM users
                WHERE deleted_at IS NULL;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

module.exports = User;