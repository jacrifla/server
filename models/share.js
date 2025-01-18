const connection = require('../config/db');
const crypto = require('crypto');

const ShareModel = {
    generateShareToken: async (listId) => {
        try {
            const token = crypto.randomBytes(20).toString('hex');

            const query = `
                INSERT INTO share_tokens (list_id, token, created_at, expires_at)
                VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 hours')
                RETURNING token, expires_at as "expiresAt";
            `;

            const values = [listId, token];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao gerar token de compartilhamento: ${error.message}`);
        }
    },

    verifyTokenValidity: async (token) => {
        const checkTokenQuery = `
            SELECT st.list_id, st.token, st.expires_at, l.user_id AS "listOwnerId" 
            FROM share_tokens st
            JOIN lists l ON st.list_id = l.id
            WHERE st.token = $1 AND st.expires_at > CURRENT_TIMESTAMP;
        `;
        const tokenResult = await connection.query(checkTokenQuery, [token]);
    
        if (tokenResult.rows.length === 0) {
            throw new Error("Token inválido ou expirado.");
        }
    
        return tokenResult.rows[0];
    },

    checkIfUserAlreadyShared: async (listId, userId) => {
        const checkSharedQuery = `
            SELECT * FROM shared_lists
            WHERE list_id = $1 AND shared_user_id = $2;
        `;
        const checkSharedResult = await connection.query(checkSharedQuery, [listId, userId]);
    
        if (checkSharedResult.rows.length > 0) {
            throw new Error("Você já foi convidado para esta lista.");
        }
    }, 
    
    addUserToSharedList: async (listOwnerId, userId, listId) => {
        const insertSharedQuery = `
            INSERT INTO shared_lists (user_id, shared_user_id, list_id)
            VALUES ($1, $2, $3)
            RETURNING id AS "sharedListId", created_at AS "createdAt";
        `;
        const insertSharedValues = [listOwnerId, userId, listId];
        const insertSharedResult = await connection.query(insertSharedQuery, insertSharedValues);
    
        return insertSharedResult.rows[0];
    },

    deleteToken: async (token) => {
        const deleteTokenQuery = `
            DELETE FROM share_tokens
            WHERE token = $1;
        `;
        await connection.query(deleteTokenQuery, [token]);
    },
    
    deleteExpiredTokens: async () => {
        const deleteExpiredTokensQuery = `
            DELETE FROM share_tokens
            WHERE expires_at < NOW();
        `;
        await connection.query(deleteExpiredTokensQuery);
    },    
    
    acceptShareToken: async (userId, token) => {
        try {
            const tokenData = await ShareModel.verifyTokenValidity(token);
            const { list_id, listOwnerId } = tokenData;
    
            await ShareModel.checkIfUserAlreadyShared(list_id, userId);
    
            const sharedList = await ShareModel.addUserToSharedList(listOwnerId, userId, list_id);

            await ShareModel.deleteToken(token);
    
            return sharedList;
        } catch (error) {
            throw new Error(`Erro ao aceitar o token de compartilhamento: ${error.message}`);
        }
    },
    
};

module.exports = ShareModel;