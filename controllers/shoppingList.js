const ListModel = require('../models/shoppingList');

exports.createList = async (req, res) => {
    const { userId, listName } = req.body;
    
    if (!userId || !listName) {
        return res.status(400).json({
            status: false,
            message: 'ID do usuário e o nome da lista são obrigatórios'
        });
    };

    try {
        const newList = await ListModel.create({userId, listName});

        res.status(201).json({
            status: true,
            message: 'Lista criada com sucesso',
            data: newList
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.findAllLists = async (req, res) => {
    try {
        const getLists = await ListModel.findAll();

        res.status(200).json({
            status: true,
            message: 'Listas listadas com sucesso',
            data: getLists
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.findListsByUserId = async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        return res.status(400).json({
            status: false,
            message: 'ID do usuário é obrigatório'
        });
    };

    try {
        const getUserLists = await ListModel.findByUserId({userId});        
        
        res.status(200).json({
            status: true,
            message: 'Listas do usuário listadas com sucesso',
            data: getUserLists
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.updateList = async (req, res) => {
    const { listId } = req.params;
    const { listName } = req.body;
    
    if (!listId ||!listName) {
        return res.status(400).json({
            status: false,
            message: 'ID da lista e o nome da lista são obrigatórios'
        });
    };

    try {
        const updateList = await ListModel.update({listId, listName});

        if (!updateList) {
            return res.status(404).json({
                status: false,
                message: 'Lista não encontrada'
            });
        };

        res.status(200).json({
            status: true,
            message: 'Lista atualizada com sucesso',
            data: updateList
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.markAsCompleted = async (req, res) => {
    const { listId } = req.params;
    const { totalAmount } = req.body;   
    
    if (!listId || totalAmount == null) {
        return res.status(400).json({
            status: false,
            message: 'ID da lista e total da lista são obrigatórios'
        });
    };

    try {
        const mark = await ListModel.markAsCompleted({listId, totalAmount });
        
        if (!mark) {
            return res.status(404).json({
                status: false,
                message: 'Lista não encontrada'
            });
        };
        
        res.status(200).json({
            status: true,
            message: 'Marcada como concluída',
            data: mark
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.deleteList = async (req, res) => {
    const { listId } = req.params;
    
    if (!listId) {
        res.status(400).json({
            status: false,
            message: 'ID da lista é obrigatório'
        });
    };
    
    try {
        const deleteList = await ListModel.delete({listId});
        
        if (!deleteList) {
            return res.status(404).json({
                status: false,
                message: 'Lista não encontrada'
            });
        };

        res.status(200).json({
            status: true,
            message: 'Lista excluída com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};