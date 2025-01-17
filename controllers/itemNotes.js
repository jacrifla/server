const ItemNotesModel = require('../models/itemNotes');

exports.createNote = async (req, res) => {
    const { userId, itemId, note } = req.body;

    try {
        const newNote = await ItemNotesModel.createNote({ userId, itemId, note });
        res.status(201).json({
            status: true,
            message: 'Anotação criada com sucesso.',
            data: newNote
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao criar anotação.',
            error: error.message
        });
    }
};

exports.getNotes = async (req, res) => {
    const { itemId } = req.params;

    try {
        const notes = await ItemNotesModel.getNotes(itemId);
        res.status(200).json({
            status: true,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao buscar anotações.',
            error: error.message
        });
    }
};

exports.updateNote = async (req, res) => {
    const { note, userId, itemId } = req.body;

    try {
        const updatedNote = await ItemNotesModel.updateNote({ note, userId, itemId });

        if (!updatedNote) {
            return res.status(404).json({
                status: false,
                message: 'Anotação não encontrada para atualizar.'
            });
        }

        res.status(200).json({
            status: true,
            message: 'Anotação atualizada com sucesso.',
            data: updatedNote
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao atualizar anotação.',
            error: error.message
        });
    }
};