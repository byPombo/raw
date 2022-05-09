const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Order = require('../models/Order')

const router = express.Router()

//AUTHENTICATION TOKEN
router.use(authMiddleware)

// LIST ALL ORDERS
router.get('/', async (req, res) => {
    try{
        const orders = await Order.find()

        return res.send({ orders })
    } catch (err) {
        return res.status(400).send({ error: "Error loading orders" })
    }
})

// LIST ORDER BY ID
router.get('/:orderId', async (req, res ) => {
    try{
        const order = await Order.findById(req.params.orderId)

        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: "Error loading order" })
    }
})

// LIST ORDErS BY USER ID

router.get('/user/:userId', async (req, res ) => {
    try{
        const order = await Order.find(req.params.user)

        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: "Error loading order" })
    }
})

// CREATE ORDER
router.post('/', async(req, res) => {
    try{
        var total = 0
        req.body.items.map(item => {
            total += item.quantity * item.unitPrice
        })

        req.body.price = total;

        // req.body.items.forEach(x => {
        //     const price = await Product.findById(x.productCode).then(product => {
        //         return product.price
        //     })

        //     req.body.unitPrice = price
        // });

        const order = await Order.create({ ...req.body, user: req.userId })

        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: "Error creating order" })
    }
})

// UPDATE ORDER
router.put('/:orderId', async (req, res ) => {
    try{
        const order = await Order.findByIdAndUpdate(req.params.orderId, {
             ...req.body}, { new: true })

        return res.send({ order })
    } catch (err) {
        return res.status(400).send({ error: "Error updating order" })
    }
})

//DELETE order
router.delete('/:orderId', async (req, res ) => {
    try{
        await Order.findByIdAndRemove(req.params.orderId)

        return res.send()
    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: "Error deleting order" })
    }
})

module.exports = app => app.use('/orders', router)