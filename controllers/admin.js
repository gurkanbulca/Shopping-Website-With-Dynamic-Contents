const Product = require('../models/product');
const Category = require('../models/category');

exports.getProducts = (req, res, next) => {
    Product
        .find({ userId: req.user })
        // .find({name:'Iphone 7',price:3000})
        // .limit(10)
        // .sort({name:1}) // a-z (z-a için -1)
        // .select({name:1,price:1})
        .populate('userId', 'name -_id')
        .select('name price userId imageUrl')
        .then(products => {
            // console.log(products);
            res.render('admin/products', {
                title: 'Admin Products',
                products: products,
                path: '/admin/products',
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getAddProduct = (req, res, next) => {

    Category.find()
        .then(categories => {
            res.render('admin/add-product', {
                title: 'New Product',
                path: '/admin/add-product',
                categories: categories,
                inputs: {
                    name: "",
                    price: "",
                    imageUrl: "",
                    description: "",
                    categories: categories
                }
            });
        })

}

exports.postAddProduct = (req, res, next) => {

    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryids = req.body.categoryids

    const product = new Product(
        {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            userId: req.user,
            categories: categoryids,
            isActive: false,
            // category:'telefon',
            tags: ['akıllı telefon']
        }
    );

    product.save()
        .then(() => {
            res.redirect('/admin/products?action=add');
        })
        .catch(err => {
            let message = '';
            if (err.name == 'ValidationError') {
                for (field in err.errors) {
                    message += err.errors[field].message + "<br>";
                }
                Category.find()
                    .then((categories) => {
                        categories.map(category => {
                            console.log(typeof categoryids);
                            if (typeof categoryids == 'object') {
                                for (let i = 0; i < categoryids.length; i++) {
                                    if (categoryids[i] == category._id) {
                                        category.selected = true;
                                    }
                                }
                            }
                            else {
                                if (categoryids == category._id) {
                                    category.selected = true;
                                }
                            }

                            return category;
                        });
                        res.render('admin/add-product', {
                            title: 'New Product',
                            path: '/admin/add-product',
                            categories: categories,
                            errorMessage: message,
                            inputs: {
                                name: name,
                                price: price,
                                imageUrl: imageUrl,
                                description: description,
                                categories: categories
                            }
                        }).catch((err) => {
                            console.log(err);
                        });

                    });
            }




        });
}

exports.getEditProduct = (req, res, next) => {

    Product
        .findOne({ _id: req.params.productid, userId: req.user._id })
        .then(product => {
            // console.log(product);
            return product;


        })
        .then(product => {
            Category.find()
                .then(categories => {
                    categories = categories.map(category => {

                        if (product.categories) {
                            product.categories.find(item => {
                                if (item.toString() === category._id.toString()) {
                                    category.selected = true;
                                }
                            })
                        }


                        return category;
                    })
                    res.render('admin/edit-product', {
                        title: 'Edit Product',
                        path: '/admin/products',
                        product: product,
                        categories: categories
                    });
                })
        })
        .catch(err => console.log(err));




}

exports.postEditProduct = (req, res, next) => {

    // query first
    // update first

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const ids = req.body.categoryids;

    Product.update({ _id: id, userId: req.user._id }, {
        $set: {
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            categories: ids
        }
    })
        .then(() => {
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => console.log(err));


    /*
    Product.findById(id)
        .then(product => {
            product.name = name;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save()
        })
        .then(()=>{
            res.redirect('/admin/products?action=edit');
        })
        .catch(err=>console.log(err));
    */

}

exports.postDeleteProduct = (req, res, next) => {

    const id = req.body.productid;

    Product.deleteOne({ _id: id, userId: req.user._id })
        .then(result => {
            if (result.deletedCount === 0) {
                return res.redirect('/');
            }
            res.redirect('/admin/products?action=delete');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getAddCategory = (req, res, next) => {
    res.render('admin/add-category', {
        title: 'New Category',
        path: '/admin/add-category',
    });
}

exports.postAddCategory = (req, res, next) => {
    new Category({ name: req.body.name, description: req.body.description })
        .save()
        .then(() => {
            res.redirect('/admin/categories?action=add');
        })
        .catch(err => console.log(err));
}


exports.getCategories = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.render('admin/categories', {
                title: 'Categories',
                path: '/admin/categories',
                categories: categories,
                action: req.query.action
            });
        })
        .catch(err => console.log(err));

}

exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryid)
        .then(category => {
            res.render('admin/edit-category', {
                title: 'Edit Category',
                path: 'admin/categories',
                category: category

            });
        })
        .catch(err => console.log(err));


}

exports.postEditCategory = (req, res, next) => {
    Category.update({ _id: req.body.id }, { $set: { name: req.body.name, description: req.body.description } })
        .then(() => {
            res.redirect('/admin/categories?action=edit');
        })
        .catch(err => console.log(err));


}

exports.postDeleteCategory = (req, res, next) => {
    Category.deleteOne({ _id: req.body.categoryid })
        .then(() => {
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err => console.log(err));
}
