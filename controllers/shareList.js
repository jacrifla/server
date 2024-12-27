const SharedListModel = require('../models/shareList');

exports.shareList = async (req, res) => {
    const { list_id, user_id } = req.body;

    try {
        const sharedList = await SharedListModel.shareList({ list_id, user_id });
        res.status(201).json({
            status: true,
            message: 'Lista compartilhada com sucesso.',
            data: sharedList
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao compartilhar lista.',
            error: error.message
        });
    }
};

exports.getSharedLists = async (req, res) => {
    const { user_id } = req.params;

    try {
        const sharedLists = await SharedListModel.getSharedLists(user_id);
        res.status(200).json({
            status: true,
            data: sharedLists
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao buscar listas compartilhadas.',
            error: error.message
        });
    }
};

exports.deleteSharedList = async (req, res) => {
    const { shared_list_id } = req.params;

    try {
        const deletedSharedList = await SharedListModel.deleteSharedList({ shared_list_id });
        
        if (!deletedSharedList) {
            return res.status(404).json({
                status: false,
                message: 'Compartilhamento de lista não encontrado.'
            });
        }
        
        res.status(200).json({
            status: true,
            message: 'Compartilhamento de lista deletado com sucesso.',
            data: deletedSharedList
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao deletar o compartilhamento.',
            error: error.message
        });
    }
};