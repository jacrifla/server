const BaseModel = require("../utils/BaseModel");

const BrandModel = new BaseModel('brands', ['name'], {
    labelMap: {
        name: 'brandName',
        id: 'brandId',
    },
    extraValidation: async ({ name }) => {
        const exists = await BrandModel.recordExists('name', name.trim());
        if (exists) throw new Error("Marca já existente.");
    },
});

module.exports = BrandModel;
