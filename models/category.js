const BaseModel = require("../utils/BaseModel");

const CategoryModel = new BaseModel('categories', ['name', 'description'], {
    labelMap: {
        name: 'categoryName',
        description: 'description',
        id: 'categoryId',
    },
    extraValidation: async ({ name }) => {
        const exists = await CategoryModel.recordExists('name', name.trim());
        if (exists) throw new Error("Categoria já existente.");
    },
});

module.exports = CategoryModel;