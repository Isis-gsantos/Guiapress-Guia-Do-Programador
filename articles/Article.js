const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category"); //importando o módulo Category 

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
    //o body é o conteúdo do artigo (texto) que vai ser escrito
})

Category.hasMany(Article); //1 relacionamento
// //hasMany representa relações 1-p-N, uma categoria tem muitos artigos

//como falar que um artigo pertence a uma categoria:
Article.belongsTo(Category); //1 relacionamento
//dentro do belongsTo() eu coloco o model que quero me relacionar. Ele representa um relacionamento 1-p-1 no sequelize

// Article.sync({force: true});

module.exports = Article; 