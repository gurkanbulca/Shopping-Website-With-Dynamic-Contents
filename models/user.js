const Product = require('./product');

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
    password:{
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = function (product) {
    const updatedCartItems = [...this.cart.items];
    const index = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString()
    });
    let itemQuantity = 1;
    if (index >= 0) {//cartta zaten eklenmek istenen product var: quantity'i arttır
        itemQuantity = this.cart.items[index].quantity + 1;
        updatedCartItems[index].quantity = itemQuantity;

    } else { //updatedCartItems'a yeni bir eleman ekle
        updatedCartItems.push({
            productId: product._id,
            quantity: itemQuantity

        });
    }

    this.cart = {
        items: updatedCartItems
    }

    return this.save();

}

userSchema.methods.deleteCartItem = function (productid) {
    this.cart.items = this.cart.items.filter(item => {
        if (productid.toString() !== item.productId.toString()) {
            return item
        }
    })
    return this.save();

}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);


