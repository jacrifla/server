const ListModel = require('../models/lists');
const ListTotals = require('../models/listTotals');

const ListController = {
    createList: async (req, res) => {
        const { listName } = req.body;
        const userId = req.user?.userId;        

        if (!listName) {
            return res.status(400).json({
                status: false,
                message: 'Nome da lista é obrigatório'
            });
        };

        try {
            const newList = await ListModel.create(userId, listName);

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
    },

    findAllLists: async (req, res) => {
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
    },

    findListsByUserId: async (req, res) => {
        const userId = req.user?.userId;

        try {
            const getUserLists = await ListModel.findByUserId(userId);

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
    },

    updateList: async (req, res) => {
        const { listId } = req.params;
        const { listName } = req.body;

        if (!listId || !listName) {
            return res.status(400).json({
                status: false,
                message: 'ID da lista e o nome da lista são obrigatórios'
            });
        };

        try {
            const updateList = await ListModel.update(listId, listName);

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
    },

    markAsCompleted: async (req, res) => {
        const userId = req.user?.userId;
        const { listId } = req.params;
        const { totalAmount, purchaseDate } = req.body;

        if (!listId || totalAmount == null || !userId) {
            return res.status(400).json({
                status: false,
                message: 'ID da lista, total da lista e ID do usuário são obrigatórios'
            });
        };

        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({
                status: false,
                message: 'O total da lista deve ser um número válido e maior que zero'
            });
        }

        try {
            // Verificar se a data foi fornecida, se não, usar a data atual
            const dateToUse = purchaseDate || new Date().toISOString().split('T')[0];

            // Passando o userId correto
            const listTotal = await ListTotals.create(listId, userId, totalAmount, dateToUse);

            // Aqui você pode marcar a lista como completada ou o que for necessário
            const mark = await ListModel.markAsCompleted(listId, totalAmount);

            if (!mark) {
                return res.status(404).json({
                    status: false,
                    message: 'Lista não encontrada'
                });
            };

            res.status(200).json({
                status: true,
                message: 'Lista marcada como concluída e total registrado',
                data: { listTotal, mark }
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    deleteList: async (req, res) => {
        const { listId } = req.params;

        if (!listId) {
            res.status(400).json({
                status: false,
                message: 'ID da lista é obrigatório'
            });
        };

        try {
            const deleteList = await ListModel.delete(listId);

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
    },
};

module.exports = ListController;
