const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const OrderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum : ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    price: {
        type: mongoose.Decimal128,
        require: true,
    },
    address: {
        street: {
            type: String,
            require: true,
        },
        number: {
            type: Number,
            require: true,
        },
        neighborhood: {
            type: String,
            require: true,
        },
        city: {
            type: String,
            require: true,
        },
        uf: {
            type: String,
            require: true,
        },
    },
    items: [{
        productCode: {
            type: String,
            require: true,
        },
        quantity: {
            type: Number,
            require: true,
        },
        unitPrice: {
            type: mongoose.Decimal128,
            require: true,
        },
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order