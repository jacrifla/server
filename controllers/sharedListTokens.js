const SharedListToken = require('../models/sharedListTokens');
const crypto = require('crypto');

exports.shareList = async (req, res) => {
    const { listId } = req.params;
    const { userId } = req.body;

    try {
        // Gerar token
        const token = crypto.randomBytes(16).toString('hex');

        // Configurar fuso horário local
        const localTimeZone = 'America/Sao_Paulo';

        // Hora atual no fuso horário local
        const now = new Date().toLocaleString('en-US', { timeZone: localTimeZone });
        const currentTime = new Date(now);

        if (isNaN(currentTime)) {
            throw new Error('Failed to determine local current time.');
        }

        // Configurar expiração
        const expiresAt = new Date(currentTime);
        expiresAt.setHours(expiresAt.getHours() + 3);

        if (isNaN(expiresAt)) {
            throw new Error('Failed to determine expiration time.');
        }

        // Salvar no banco
        const newToken = await SharedListToken.create({
            listId,
            userId,
            token,
            expiresAt: expiresAt.toISOString(),
            createdAt: currentTime.toISOString(),
        });

        // Responder com sucesso
        res.status(200).json({
            status: true,
            message: 'Lista compartilhada com sucesso!',
            token: newToken.token,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao compartilhar a lista',
            error: error.message,
        });
    }
};
exports.findToken = async (req, res) => {
    const { token } = req.params;

    try {
        const tokenData = await SharedListToken.findToken({ token });

        if (!tokenData) {
            return res.status(400).json({
                status: false,
                message: 'Token inválido ou expirado.',
            });
        }

        res.status(200).json({
            status: true,
            message: 'Token válido.',
            data: tokenData,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao verificar o token.',
            error: error.message,
        });
    }
};


exports.deleteToken = async (req, res) => {
    const { token } = req.params;

    try {
        await SharedListToken.delete({token});

        res.status(200).json({
            status: true,
            message: 'Compartilhamento revogado com sucesso!'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao revogar compartilhamento',
            error: error.message
        });
    }
};

exports.findAlltoken = async (req, res) => {
    try {
        const token = await SharedListToken.findAllToken();
        res.status(200).json({
            status: true,
            message: 'Tokens listados com sucesso',
            data: token
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao revogar compartilhamento',
            error: error.message
        });
    }
};
