const userRoutes = require('../routes/user');
const brandRoutes = require('../routes/brand');
const categoryRoutes = require('../routes/category');

module.exports = (app) => {
    app.use('/', userRoutes);
    app.use('/', brandRoutes);
    app.use('/', categoryRoutes);
}