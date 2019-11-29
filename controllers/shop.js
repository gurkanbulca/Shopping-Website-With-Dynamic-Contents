const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order');


// eq (equal)
// ne (not equal)
// gt (greater than)
// gte (greater than or equal)
// lt (less than)
// lte (less than or equal)
// in 
// nin (not in)
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

exports.getIndex = (req, res, next) => {

    // console.log(req.cookies.isAuthenticated);
    console.log(req.session.isAuthenticated);


    Product.find()
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/index', {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        isAuthenticated: req.session.isAuthenticated,
                        path: '/'
                    });
                })



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


    Product
        .find()
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        isAuthenticated: req.session.isAuthenticated,
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


    Product.find({ categories: categoryid })
        .then(products => {
            Category.find()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        selectedCategory: categoryid,
                        isAuthenticated: req.session.isAuthenticated,
                        path: '/products'
                    });
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));


}

exports.getProduct = (req, res, next) => {

    Product.findById(req.params.productid)
        .populate('categories', 'name')
        .then(product => {
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                isAuthenticated: req.session.isAuthenticated,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            console.log(user.cart.items);
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                action: req.query.action,
                isAuthenticated: req.session.isAuthenticated,
                products: user.cart.items
            })
        })
        .catch(err => console.log(err));


}

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    Product
        .findById(productId)
        // .findOne({ _id: req.params.productid })
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

    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                isAuthenticated: req.session.isAuthenticated,
                orders: orders
            });
        })
        .catch(err => console.log(err));






}

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const order = new Order({
                user: {
                    userId: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                },
                items: user.cart.items.map(p => {


                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl
                        },
                        quantity: p.quantity
                    };
                })
            })

            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));

    req.user.addOrder()
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));

}


