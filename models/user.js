const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

module.exports = mongoose.model('User',userSchema);




// const getDb = require('../utility/database').getdb;
// const mongodb = require('mongodb');
// const Product = require('./product');

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : {};
//         this.cart.items = cart ? cart.items : [];
//         this._id = id;
//     }

//     save() {
//         // const db = getDb();

//         // return db.collection('users')
//         //     .insertOne(this)

//         let db = getDb();
//         if (this._id) {
//             db = db.collection('users').updateOne({ _id: this._id }, { $set: this });
//         }
//         else {
//             db = db.collection('users').insertOne(this);
//         }

//         return db
//             .then(result => {
//                 return result;
//             })
//             .catch(err => console.log(err));


//     }

//     getCart() {
//         const ids = this.cart.items.map(i => {
//             return i.productId;
//         });
//         const db = getDb();
//         return db.collection('products')
//             .find({
//                 _id: { $in: ids }
//             })
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     return {
//                         ...product,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === product._id.toString()
//                         }).quantity
//                     }
//                 });
//             })
//             .catch(err => console.log(err));


//     }

//     addToCart(product) {
//         const updatedCartItems = [...this.cart.items];
//         const index = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString()
//         });
//         let itemQuantity = 1;
//         if (index >= 0) {//cartta zaten eklenmek istenen product var: quantity'i arttır
//             itemQuantity = this.cart.items[index].quantity + 1;
//             updatedCartItems[index].quantity = itemQuantity;

//         } else { //updatedCartItems'a yeni bir eleman ekle
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectID(product._id),
//                 quantity: itemQuantity

//             });
//         }

//         const db = getDb();
//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectID(this._id) },
//                 {
//                     $set: {
//                         cart: {
//                             items: updatedCartItems
//                         }
//                     }
//                 }

//             )


//     }

//     deleteCartItem(productid) {
//         this.cart.items = this.cart.items.filter(item => {
//             if (productid.toString() !== item.productId.toString()) {
//                 return item
//             }
//         })
//         return this.save();

//     }

//     addOrder() {
//         //get cart

//         // create order object

//         // save order

//         // update card

//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products.map(item => {
//                         return {
//                             _id: item._id,
//                             name: item.name,
//                             price: item.price,
//                             imageUrl: item.imageUrl,
//                             userId: item.userId,
//                             quantity: item.quantity
//                         }
//                     }),
//                     user: {
//                         _id: mongodb.ObjectID(this._id),
//                         name: this.name,
//                         email: this.email
//                     },
//                     date: new Date().toLocaleString()
//                 }

//                 return db.collection('orders').insertOne(order);
//             })
//             .then(() => {
//                 this.cart = { items: [] };
//                 return db.collection('users')
//                     .updateOne({ _id: new mongodb.ObjectID(this._id) },
//                         { $set: { cart: { items: [] } } })
//             })


//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders')
//             .find({'user._id': new mongodb.ObjectId(this._id)})
//             .toArray()
//             .then(orders => {
//                 console.log(orders);
//                 return orders;
//             })

//     }

//     static findById(userid) {
//         const db = getDb();

//         return db.collection('users')
//             .findOne({ _id: new mongodb.ObjectID(userid) })
//             .then((user) => {
//                 return user;
//             }).catch((err) => {
//                 console.log(err);
//             });
//     }

//     static findByUserName(username) {
//         const db = getDb();

//         return db.collection('users')
//             .findOne({ name: username })
//             .then((user) => {
//                 return user;
//             }).catch((err) => {
//                 console.log(err);
//             });
//     }

// }



// module.exports = User;