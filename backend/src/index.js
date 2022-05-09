require("dotenv").config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express();
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

require('./app/controllers/index')(app)

app.listen(port, ()=> {
    console.log(`[Backend started at http:localhost:${port}]`)
})