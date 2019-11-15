const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
    Product.getAll()
        .then((products) => {
            Category.getAll()
                .then((categories) => {
                    res.render("shop/index", {
                        title: "Shopping",
                        products: products[0],
                        categories: categories[0],
                        path: "/"
                    });
                }).catch((err) => {
                    console.log(err);
                });

        })
        .catch((err) => {
            console.log(err);
        });

};

exports.getProducts = (req, res, next) => {


    Product.getAll()
        .then((result) => {
            Category.getAll()
                .then((categories) => {
                    res.render("shop/products", {
                        title: "Products",
                        categories: categories[0],
                        products: result[0],
                        path: "/products"
                    });
                }).catch((err) => {
                    console.log(object);
                });

        }).catch((err) => {
            console.log(err);
        });

};

exports.getProduct = (req, res, next) => {
    Product.getById(req.params.productid)
        .then(product => {
            Category.getById(product[0][0].categoryid)
                .then((category) => {
                    res.render("shop/product-detail", {
                        title: product[0][0].name,
                        product: product[0][0],
                        path: "/products",
                        category: category[0][0]
                    });
                }).catch((err) => {
                    console.log(err);
                });

        }).catch((err) => {
            console.log(err);
        });


};

exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid;
    Product.getProductsByCategoryId(categoryid)
        .then((products) => {
            Category.getAll()
                .then((categories) => {
                    res.render("shop/products", {
                        title: "Products",
                        products: products[0],
                        categories: categories[0],
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