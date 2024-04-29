const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
        //ou seja, estou falando para o sequelize que na busca de artigos ele inclua os dados do tipo Category, ele faz isso pelo relacionamento (belongsTo)
        //agora com o include em mãos eu vou até minah view e onde trm categoryId vai mudar por category.title
    }).then((articles => {
        res.render("admin/articles/index", {articles: articles})
        //para puxar o nome da categoria do artigo (ao invés de aparecer apenas o id da categoria que escolhi para o artigo vai ser o nome) tem que dar um join na busca. Dentro do findAll abre um objeto json e dentro dele passa include: [{model: --}]
    }));
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories: categories})
    })
});

router.post("/articles/save", (req, res) => {
    var title = req.body.title; 
    var body = req.body.body; 
    var category = req.body.category;  

    Article.create({
        title: title,
        slug: slugify(title),
        body: body, 
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            })
        } else {
            res.redirect("/admin/articles");
        }
    } else {
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req, res) => {
    var id = req.params.id;

    Article.findByPk(id).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories: categories, article: article});
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body; 
    var category = req.body.category;
    
    Article.update({title: title, slug: slugify(title), body: body, categoryId: category}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

//paginação de artigos
router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    
    if(isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 4;
        //diminuiu o offset por 1 por causa que não exibia todos os artigos devido a um bug
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        var next; 
        if(offset + 4 >= articles.count) {
            next = false;
        }else {
            next = true;
        }

        var result = {
            articles: articles,
            next: next,
            page: parseInt(page) //diz qual é a página atual (que consegue através do parâmetro page que é uma string)
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})
        });
    })
});

module.exports = router;