const { Sequelize } = require('sequelize');
const initModels = require('./init-models');
const config = require('../config/config').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
    define: { underscored: true }
});

const db = initModels(sequelize);
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;