const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: mongoose.Decimal128,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product