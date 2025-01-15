const SharedListToken = require('../models/sharedListTokens');
const { DateTime } = require('luxon');
const crypto = require('crypto');
const SharedListModel = require('../models/shareList');

exports.generateToken = async (req, res) => {
    const { listId, userId } = req.body;

    if (!listId || !userId) {
        return res.status(400).json({
            status: false,
            message: 'Faltando dados essenciais: listId e userId são obrigatórios.',
        });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = DateTime.now().plus({ hours: 5 }).toUTC().toISO();

    try {
        const newToken = await SharedListToken.generateToken({ listId, userId, token, expiresAt });

        res.status(201).json({
            status: true,
            message: 'Token gerado com sucesso.',
            data: newToken,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
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
            message: error.message,
        });
    }
};

exports.revokeToken = async (req, res) => {
    const { token } = req.params;

    try {
        await SharedListToken.delete({ token });

        res.status(200).json({
            status: true,
            message: 'Compartilhamento revogado com sucesso!',
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.findAllToken = async (req, res) => {
    try {
        const tokens = await SharedListToken.findAllToken();
        res.status(200).json({
            status: true,
            message: 'Tokens listados com sucesso.',
            data: tokens,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.grantAccess = async (req, res) => {
    const { token, userId } = req.body;

    try {
        // Verificar se o token existe e está válido
        const tokenData = await SharedListToken.findToken({ token });
        if (!tokenData) {
            return res.status(400).json({
                status: false,
                message: 'Token inválido ou expirado.',
            });
        }

        // Pegar o ID da lista associado ao token
        const { listId } = tokenData;

        // Conceder permissão
        const shareList = await SharedListModel.grantPermission({ listId, userId });

        const formattedShareList = {
            sharedListId: shareList.shared_list_id,
            listId: shareList.list_id,
            userId: shareList.user_id,
            permission: shareList.permission,
            sharedAt: shareList.shared_at,
        };

        // Após conceder a permissão, apagar o token
        await SharedListToken.delete({ token });

        res.status(200).json({
            status: true,
            message: 'Permissão concedida com sucesso.',
            data: formattedShareList,
        });
    } catch (error) {
        if (error.message.includes('duplicate key value violates unique constraint')) {
            return res.status(400).json({
                status: false,
                message: 'A lista já foi compartilhada com esse usuário.',
            });
        }

        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};
