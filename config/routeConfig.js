const userRoutes = require('../routes/user');
const brandRoutes = require('../routes/brand');
const categoryRoutes = require('../routes/category');
const itemRoutes = require('../routes/items');
const listRoutes = require('../routes/lists');
const listItemRoutes = require('../routes/listItem');
const priceHistoryRoutes = require('../routes/purchases');
const sharedListRoutes = require('../routes/share');
const unitRoutes = require('../routes/unit');

module.exports = (app) => {
    app.use('/user', userRoutes);
    app.use('/brand', brandRoutes);
    app.use('/category', categoryRoutes);
    app.use('/items', itemRoutes);
    app.use('/list', listRoutes);
    app.use('/list-item', listItemRoutes);
    app.use('/purchase', priceHistoryRoutes);
    app.use('/shared-list-tokens', sharedListRoutes);
    app.use('/unit', unitRoutes);
}