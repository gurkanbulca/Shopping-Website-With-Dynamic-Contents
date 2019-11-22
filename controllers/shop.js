const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
    Product.findAll({ attributes: ['id', 'name', 'price', 'imageUrl'] })
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
        attributes: ['id', 'name', 'price', 'imageUrl']

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
        attributes: ['id', 'name', 'price', 'imageUrl', 'description', 'categoryid'],
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
    let _cartid;
    req.user.getCart()
        .then(cart => {
            _cartid = cart.id;
            return cart.getProducts()
                .then(products => {
                    res.render("shop/cart", {
                        title: "Cart",
                        path: "/cart",
                        products: products,
                        cartid: _cartid
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            console.log(err);
        })


};

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    let quantity = 1;
    let userCart;

    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                quantity += product.cartItem.quantity;
                return product;
            }
            return Product.findByPk(productId);

        })
        .then(product => {
            userCart.addProduct(product, {
                through: {
                    quantity: quantity
                }
            })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })


};

exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productid } });
        })
        .then(products => {
            const product = products[0];

            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));


};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render("shop/orders", {
                title: "Orders",
                path: "/orders",
                orders: orders
            });
        })
        .catch(err => console.log(err));


    
};

exports.postOrder = (req, res, next) => {
    let userCart;
    req.user.getCart()
        .then(cart => {
            userCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity,
                            price: product.price
                        }
                        return product;
                    }));
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            userCart.setProducts(null);
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(err => console.log(err));



    
}