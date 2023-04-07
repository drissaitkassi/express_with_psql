const express = require('express')
const database=require('./db')
const bodyParser = require('body-parser')
const app = express()
const jwt=require('jsonwebtoken')
const cookieParser= require('cookie-parser')
const port = 3000
var cors = require('cors')

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(
bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (req, res) => {
  res.json({message:'Hello World!'})
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/products',database.getProducts)
app.delete('/products/:id',database.deleteProduct)
app.get('/products/:name',database.getProductsByName)
app.post('/user',database.createUser)
app.post('/products',database.createProducts)
app.put('/products/:id',database.updateProducts)
app.post('/login',database.login)

// app.post('/register')
// app.post('/logout')




