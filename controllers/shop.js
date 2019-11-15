const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
    Product.findAll({attributes: ['id','name','price','imageUrl']})
        .then((products) => {
            Category.findAll()
                .then((categories) => {
                    res.render("shop/index", {
                        title: "Shopping",
                        products: products,
                        categories: categories,
                        path: "/"
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });



};

exports.getProducts = (req, res, next) => {
    Product.findAll({
        attributes: ['id','name','price','imageUrl']
        
    })
        .then((products) => {
            Category.findAll()
                .then((categories) => {
                    res.render("shop/products", {
                        title: "Products",
                        products: products,
                        categories: categories,
                        path: "/products"
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });



};

exports.getProduct = (req, res, next) => {

    Product.findAll({ 
        attributes: ['id','name','price','imageUrl','description','categoryid'],
        where: { id: req.params.productid } 
    })
        .then((products) => {
            Category.findAll({ where: { id: products[0].categoryid } })
                .then((categories) => {
                    res.render("shop/product-detail", {
                        title: products[0].name,
                        product: products[0],
                        path: "/products",
                        category: categories[0]
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });

    /*
    Product.findByPk(req.params.productid)
        .then(product => {
            Category.findByPk(product.categoryid)
                .then((category) => {
                    res.render("shop/product-detail", {
                        title: product.name,
                        product: product,
                        path: "/products",
                        category: category
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });
        */


};

exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid;
    Product.findAll({ where: { categoryId: categoryid } })
        .then((products) => {
            Category.findAll()
                .then((categories) => {
                    res.render("shop/products", {
                        title: "Products",
                        products: products,
                        categories: categories,
                        selectedCategory: categoryid,
                        path: "/products"
                    });
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });



};


exports.getCart = (req, res, next) => {


    const products = Product.getAll();
    res.render("shop/cart", {
        title: "Cart",
        path: "/cart"
    });
};

exports.getOrders = (req, res, next) => {


    const products = Product.getAll();
    res.render("shop/orders", {
        title: "Orders",
        path: "/orders"
    });
};