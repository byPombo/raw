const express = require('express')
const Product = require('../models/Product')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

//AUTHENTICATION TOKEN
router.use(authMiddleware)

// LIST ALL PRODUCTS
router.get('/', async (req, res) => {
    try{
        const products = await Product.find()

        return res.send({ products })
    } catch (err) {
        return res.status(400).send({ error: "Error loading products" })
    }
})

// LIST PRODUCT BY ID
router.get('/:productId', async (req, res ) => {
    try{
        const product = await Product.findById(req.params.productId)

        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: "Error loading product" })
    }
})

// CREATE PROCUCT
router.post('/', async(req, res) => {
    try{
        const product = await Product.create({ ...req.body })

        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: "Error creating product" })
    }
})

// UPDATE PRODUCT
router.put('/:productId', async (req, res ) => {
    try{
        const product = await Product.findByIdAndUpdate(req.params.productId, {
             ...req.body}, { new: true })

        return res.send({ product })
    } catch (err) {
        return res.status(400).send({ error: "Error updating product" })
    }
})

//DELETE PRODUCT
router.delete('/:productId', async (req, res ) => {
    try{
        await Product.findByIdAndRemove(req.params.productId)

        return res.send()
    } catch (err) {
        return res.status(400).send({ error: "Error deleting product" })
    }
})

module.exports = app => app.use('/products', router)