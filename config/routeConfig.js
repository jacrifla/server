const userRoutes = require('../routes/user');
const brandRoutes = require('../routes/brand');
const categoryRoutes = require('../routes/category');
const itemRoutes = require('../routes/items');

module.exports = (app) => {
    app.use('/user', userRoutes);
    app.use('/brand', brandRoutes);
    app.use('/category', categoryRoutes);
    app.use('/items', itemRoutes);
}