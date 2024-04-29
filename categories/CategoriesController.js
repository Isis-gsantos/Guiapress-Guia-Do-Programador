const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");

router.get("/admin/categories/new", (req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
    var title = req.body.title;
    if(title != undefined) {
        Category.create({
            title: title, 
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories"); //o que antes mandava para a oágina inicial agora manda para a de categoriaas, criada posteriormente a de save
        })
    } else {
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", {categories: categories});
    });
});

router.post("/categories/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/categories");
            })
        } else {
            res.redirect("/admin/categories");
        }
    } else {
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req, res) => {
    var id = req.params.id;

    //o sequelize tem um problema, se eu colcocar um número (id) no url /admin/categories/edit/10 se eu colocar esse número seguido por uma string o sequelize vai achar a categoria da mesma forma, mas isso é um bug que pode acarretar em problemas, para evitar que isso aconteça é preciso verificar se ele é ou não um número
    if(isNaN(id)) {
        res.redirect("/admin/categories");
    }

    //como eu vou receber o id da categoria que eu quero editar tenho que pesquisar essa categoria no meu banco de dados. O findByPk() é um método específico para pesquisar uma categoria pelo id dela, método mais rápido de pesquisar algo pelo id
    Category.findByPk(id).then(category => {
        if(category != undefined) {
            //se minha categoria foi encontrada, vou pega-la e vou passa-la para uma view (view criada dentro da pasta de categories chamada de edit.ejs)
            res.render("admin/categories/edit", {category: category});
        } else {
            res.redirect("/admin/categories");
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    })
});

router.post("/categories/update", (req, res) => {
    //para atualizar uma categoria precisa de 2 dados que são o id da categoria (para saber qual categoria em específico tem que atualizar no banco) e o título atualizado da categoria, ambos vão ser recebidos via formulário do edit.ejs
    var id = req.body.id;
    var title = req.body.title;

    //dentro do update coloca o dado que eu quero atualizar, que no caso é o title que vai receber a variável title do formulário, e depois fala qual categoria quero atualizar no banco de dados (através do where)
    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
            //ou seja, quero atualizar o título de uma categoria pelo id. Fala pro sequelize atualizar o titulo da categoria que está sendo recebida pelo formulário 
        }
    }).then(() => {
        res.redirect("/admin/categories");
    })
});

module.exports = router;