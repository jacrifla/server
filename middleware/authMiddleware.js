const jwt = require('jsonwebtoken');
const db = require('../config/db');
const JWT_SECRET = process.env.SECRET_KEY;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: false,
            message: 'Token não fornecido'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const result = await db.query(
            `
            SELECT id as "userId", name, email
            FROM users
            WHERE id = $1;
            `,
            [decoded.userId]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({
                status: false,
                message: 'Usuário não existe mais'
            });
        }

        req.user = result.rows[0];
        next();

    } catch (error) {
        return res.status(401).json({
            status: false,
            message: `Token inválido ou expirado, ${error}`
        });
    }
}

module.exports = authMiddleware;