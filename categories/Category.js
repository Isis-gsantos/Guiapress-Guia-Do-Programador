const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
//o slug é o endereço da categoria, por ex se uma categoria tem o título "Desenvolvimento web" o slug seria desenvolvimento-web, se uma categoria tem um título "React JS" o slug seria react-js. Ou seja, ele é uma versão do titulo da categoria que vai usar em uma url/roat

// Category.sync({force: true});
//sempre que eu estiver chamando essse método, toda vez que minha aplicação recarregar ele vai recriar a tabela e depois que criou a tabela vou excluir para que ele não fique recriando toda hora 

module.exports = Category;