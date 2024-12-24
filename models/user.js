const connection = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;
const saltos = 10;

const User = {
    create: async ({ name, email, password}) => {
        try {
            const hashedPassword = await bcrypt.hash(password, saltos);
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

    findByEmail: async ({email}) => {
        try {
            const query = `
                SELECT user_id, email, name, created_at
                FROM users
                WHERE email = $1;
            `;
            const values = [email];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuario por email: ${error.message}`);
        }
    },

    findById: async ({userId}) => {
        try {
            const query = `
                SELECT user_id, email, name, created_at
                FROM users
                WHERE user_id = $1;
            `;
            const values = [userId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar usuario por id: ${error.message}`);
        }
    },

    update: async ({userId, name, email}) => {
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
    
    
    delete: async () => {},
    restore: async () => {},
    verifyToken: async () => {},
    generateToken: async () => {},
    login: async () => {},
    resetPassword: async () => {},

}

module.exports = User;