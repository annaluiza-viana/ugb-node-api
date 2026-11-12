const { Sequelize } = require("sequelize") //importa so uma parte

const sequelize = new Sequelize ({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false
});

module.exports = sequelize;