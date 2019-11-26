const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res, next) => {

    Product.find()
        .then(products => {
            res.render('shop/index', {
                title: 'Shopping',
                products: products,
                path: '/'
            });


            // Category.find()
            //     .then(categories => {
            //         res.render('shop/index', {
            //             title: 'Shopping',
            //             products: products,
            //             categories: categories,
            //             path: '/'
            //         });
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProducts = (req, res, next) => {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal)
    // lt (less than)
    // lte (less than or equal)
    // in 
    // nin (not in)


    Product
        .find()
        // .find({price: {$eq: 2000}})
        // .find({price: {$ne: 2000}})
        // .find({price: {$gt: 2000}})
        // .find({price: {$gte: 2000}})
        // .find({price: {$lt: 2000}})
        // .find({price: {$eq: 2000}})
        // .find({price: {$in: [1000,2000,3000]}})
        // .find({price: {$nin: [1000,2000,3000]}})
        // .find({ price: { $gte: 1000, $lte: 2000 } })
        // .find({price: {$gt: 2000},name:'Samsung S6'})
        // .or([{price: {$gt: 2000},name:'Samsung S6'}])
        // .find({name:/^Samsung/}) starts with
        // .find({name:/Samsung$/}) ends with
        // .find({ name: /.*Samsung.*/ }) contains

        .then(products => {

            Category.find()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        path: '/products'
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProductsByCategoryId = (req, res, next) => {
    const categoryid = req.params.categoryid;


    Product.findByCategoryId(categoryid)
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        selectedCategory: categoryid,
                        path: '/products'
                    });
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));


}

exports.getProduct = (req, res, next) => {

    Product.findById(req.params.productid)
        .then(product => {
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                action: req.query.action,
                products: products
            })
        })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    Product
        //.findById(productId)
        .findOne({ _id: req.params.productid })
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}

exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user.deleteCartItem(productid)
        .then(() => {
            res.redirect('/cart?action=delete');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {

    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            });
        })




}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}


