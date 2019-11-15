const Product = require("../models/product");
const Category = require("../models/category");


exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            Category.findAll()
                .then((categories) => {
                    res.render("admin/products", {
                        title: "Admin Products",
                        products: products,
                        categories: categories,
                        path: "/admin/products",
                        action: req.query.action
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });

};

exports.getAddProduct = (req, res, next) => {
    
    Category.findAll()
        .then((categories) => {
            res.render("admin/add-product", {
                title: " New Product",
                path: "/admin/add-product",
                categories: categories
            });
        }).catch((err) => {
            console.log(err);
        });
};

exports.postAddProduct = (req, res, next) => {
    
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const categoryid = req.body.categoryid;
    const description = req.body.description;
    
    Product.create({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        categoryId: categoryid
    })
        .then((result) => {
            console.log(result);
            res.redirect("/admin/products?action=add");
        }).catch((err) => {
            console.log(err);
        });
    

    

};

exports.getEditProduct = (req, res, next) => {
    Product.findByPk(req.params.productid)
        .then((product) => {
            if(!product){
                return res.redirect('/');
            }
            Category.findAll()
                .then((categories) => {
                    res.render("admin/edit-product", {
                        title: " Edit Product",
                        path: "/admin/products",
                        product: product,
                        categories: categories
                    });
                }).catch((err) => {
                    console.log(err);
                });


        }).catch((err) => {

        });
        
};

exports.postEditProduct = (req, res, next) => {

    const product = new Product();
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const categoryid = req.body.categoryid;

    Product.findByPk(id)
        .then((product) => {
            product.name=name;
            product.price=price;
            product.description=description;
            product.imageUrl=imageUrl;
            product.categoryid=categoryid;
            return product.save()
        })
        .then(result=>{
            console.log('updated');
            res.redirect("/admin/products?action=edit");
        })
        .catch((err) => {
            console.log(err);
        });





};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productid;

    Product.findByPk(id)
        .then((product) => {
            return product.destroy();
        })
        .then(()=>{
            console.log("Product has been deleted.");
            res.redirect("/admin/products?action=delete");
        })
        .catch((err) => {
            console.log(err);
        });

    /*
    Product.destroy({where:{id:id}}).then(()=>{
        res.redirect("/admin/products?action=delete");
    }).catch(err=>{
        console.log(err);
    });
    */
    

}