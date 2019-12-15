const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'ürün ismi girmelisiniz.']
        , minlength: [5, 'ürün ismi için en az 5 karakter girmelisiniz.'],
        maxlength: [255, 'ürün ismi için en fazla 255 karakter girmelisiniz.'],
        lowercase: true,
        // uppercase: true
        trim: true // baştaki ve sondaki boşlukları siler
    },
    price: {
        type: Number,
        required: function () {
            return this.isActive;
        },
        min: 0,
        max: 10000,
        get: value => Math.round(value),
        set: value => Math.round(value)
    },
    description: {
        type: String,
        minlength: [10, 'Description alanı için en az 10 karakter girmelisiniz.']
    },
    imageUrl: String,
    date: { type: Date, default: Date.now },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: {
        type: String,
        enum: ['telefon', 'bilgisayar']
    },
    tags: { // ['akıllı telefon','4 çekirdek']
        type: Array,
        validate: {
            validator: function (value) {
                return value && value.length > 0;
            },
            message: 'ürün için en az bir etiket giriniz.'
        }
    },
    isActive: Boolean,
    categories: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: false
        }
    ]
});

module.exports = mongoose.model('Product', productSchema);



