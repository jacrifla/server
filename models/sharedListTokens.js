const connection = require('../config/db');

const SharedListToken = {
    generateToken: async ({ listId, userId, token, expiresAt }) => {
        try {
            const query = `
                INSERT INTO shared_list_tokens (list_id, user_id, token, expires_at, created_at)
                VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
                RETURNING token_id, token, expires_at, created_at;
            `;
            const values = [listId, userId, token, expiresAt];

            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    delete: async ({token}) => {
        try {
            const query = `
                DELETE FROM shared_list_tokens
                WHERE token = $1;
            `;
            const values = [token];
            await connection.query(query, values);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findToken: async ({ token }) => {
        try {
            // Obter hora atual no fuso horário correto
            const localTimeZone = 'America/Sao_Paulo';
            const now = new Date().toLocaleString('en-US', { timeZone: localTimeZone });
            const currentTime = new Date(now);
    
            if (isNaN(currentTime)) {
                throw new Error('Erro ao determinar a hora atual local.');
            }
    
            // Consultar token no banco de dados
            const query = `
                SELECT list_id, user_id, expires_at
                FROM shared_list_tokens
                WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP;
            `;
            const values = [token];
            const result = await connection.query(query, values);
    
            // Verificar se o token existe
            if (result.rows.length === 0) {
                return null;
            }
    
            const tokenData = result.rows[0];
            const expiresAt = new Date(tokenData.expires_at);
    
            if (isNaN(expiresAt)) {
                throw new Error('Erro ao determinar a data de expiração do token.');
            }
    
            // Comparar hora atual com a expiração
            if (currentTime > expiresAt) {
                return null;
            }
    
            return tokenData;
        } catch (error) {
            throw new Error(`Erro ao encontrar o token: ${error.message}`);
        }
    },

    findAllToken: async () => {
        try {
            const query = `
                SELECT token_id, token, expires_at, created_at
                FROM shared_list_tokens;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
}

module.exports = SharedListToken;