const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const saltRounds = 10;

const User = {
    create: async ({ name, email, password }) => {
        try {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const query = `
                INSERT INTO users (name, email, password, created_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING user_id, name, email, created_at;
            `
            const values = [name, email, hashedPassword];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar usuario: ${error.message}`);
        }
    },

    findByEmail: async ({ email }) => {
        try {
            const query = `
                SELECT user_id, email, name, created_at
                FROM users
                WHERE email = $1 AND deleted_at IS NULL;
            `;
            const values = [email];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuario por email: ${error.message}`);
        }
    },

    findById: async ({ userId }) => {
        try {
            const query = `
                SELECT user_id, email, name, created_at
                FROM users
                WHERE user_id = $1 AND deleted_at IS NULL;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuario por id: ${error.message}`);
        }
    },

    update: async ({ userId, name, email }) => {
        try {
            const fields = [];
            const values = [];

            if (name) {
                fields.push('name = $2');
                values.push(name);
            };

            if (email) {
                fields.push('email = $3');
                values.push(email);
            };

            if (fields.length === 0) {
                throw new Error('Nenhum dado para atualizar');
            };

            const query = `
                UPDATE users
                SET ${fields.join(', ')}
                WHERE user_id = $1
                RETURNING user_id, name, email, created_at;
            `;

            values.unshift(userId);

            const result = await connection.query(query, values);
            return result.rows[0];

        } catch (error) {
            throw new Error(`Erro ao atualizar usuario: ${error.message}`);
        }
    },

    delete: async ({ userId }) => {
        try {
            const query = `
                UPDATE users
                SET deleted_at = CURRENT_TIMESTAMP
                WHERE user_id = $1 AND deleted_at IS NULL;
            `

            const values = [userId];
            const result = await connection.query(query, values);

            return result.rowCount;
        } catch (error) {
            throw new Error(`Erro ao deletar usuario: ${error.message}`);
        }
    },

    restore: async ({ email }) => {
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
            throw new Error(`Erro ao restaurar usuario: ${error.message}`);
        }
    },

    verifyPassword: async ({password, storedPassword}) => {
        try {
            const isMatch = await bcrypt.compare(password, storedPassword);
            if (!isMatch) {
                throw new Error('Senha inválida');
            };
            return isMatch;
        } catch (error) {
            throw new Error(`Erro: ${error.message}`); 
        }
    },

    generateToken: ({userId}) => {
        const payload = { userId };
        const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });
        return token;
    },

    login: async ({email, password}) => {
        try {
            const query = `
                SELECT user_id, name, email, password
                FROM users
                WHERE email = $1 AND deleted_at IS NULL;
            `;
            const values = [email];
            const result = await connection.query(query, values);

            if (result.rowCount === 0) {
                throw new Error('Usuário não encontrado');
            }

            const user = result.rows[0];
            await User.verifyPassword({ password, storedPassword: user.password });

            delete user.password;

            const token = User.generateToken(user.user_id);
            return { user, token };
        } catch (error) {
            throw new Error(`Erro ao logar: ${error.message}`); 
        }
    },

    resetPassword: async ({ email, newPassword }) => {
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

            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const updatePassword = `
                UPDATE users
                SET password = $1
                WHERE email = $2 AND deleted_at IS NULL;
            `;
            const values = [hashedPassword, email];
            const resultUpdate = await connection.query(updatePassword, values);

            return resultUpdate.rowCount;
        } catch (error) {
            throw new Error(`Erro ao resetar senha do usuario: ${error.message}`);
        }
    },


}

module.exports = User;