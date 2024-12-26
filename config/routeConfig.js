const userRoutes = require('../routes/user');
const brandRoutes = require('../routes/brand');

module.exports = (app) => {
    app.use('/', userRoutes);
    app.use('/', brandRoutes);
}