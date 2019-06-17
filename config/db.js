const Sequelize = require("sequelize");
const db = new Sequelize('uptaskdb', 'root', 'admin', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    operatorAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});

module.exports = db;