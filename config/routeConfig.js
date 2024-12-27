const userRoutes = require('../routes/user');
const brandRoutes = require('../routes/brand');
const categoryRoutes = require('../routes/category');
const itemRoutes = require('../routes/items');
const listRoutes = require('../routes/shoppingList');
const listItemRoutes = require('../routes/listItem');
const priceHistoryRoutes = require('../routes/priceHistory');
const itemNotesRoutes = require('../routes/itemNotes');
const shareListRoutes = require('../routes/shareList');
const sharedListTokensRoutes = require('../routes/sharedListTokens');

module.exports = (app) => {
    app.use('/user', userRoutes);
    app.use('/brand', brandRoutes);
    app.use('/category', categoryRoutes);
    app.use('/items', itemRoutes);
    app.use('/shopping-list', listRoutes);
    app.use('/list-item', listItemRoutes);
    app.use('/price-history', priceHistoryRoutes);
    app.use('/item-notes', itemNotesRoutes);
    app.use('/share-list', shareListRoutes);
    app.use('/shared-list-tokens', sharedListTokensRoutes);
}