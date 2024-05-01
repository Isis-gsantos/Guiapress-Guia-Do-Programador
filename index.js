const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticleController");
const userController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./user/User");

//View engine
app.set("view engine", "ejs");

//Sessions
app.use(session({
    secret: "kasdkasdlsd", //palavra qualquer que o express-session vai utilizar para aumentar a segurança das sessões. É como se fosse uma senha para decriptar as sessões, como se fosse o salt do bcrypt, é recomendado colocar algo bem aleatório
    cookie: { maxAge: 30000 } //configurando a forma como o cookie vai ser salvo no navegador do usuário. Os dados da sessão ficam salvos no servidor, mas a sessão precisa de um cookie para funcionar, ele é como se fosse um cookie de identificação (ele vai dizer que o usuário tem uma sessão no servidor)
    //os cookies tem a capacidade de expirar, então coloca o tempo de expiração dele através do atributo maxAge (o valor é em milissegundos)
}))

//Static 
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({extended: false})); //aceita dados de formulário
app.use(bodyParser.json()); //aceita dados do formato json

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        })
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug, 
        }
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}] 
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories}); 
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.listen(8080, () => {
    console.log("O servidor está rodando!");
});