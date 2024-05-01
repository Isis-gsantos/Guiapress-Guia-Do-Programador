const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// User.sync({force: false});
//depois vou comentar essa linha para não criar a tabela toda hora

module.exports = User;