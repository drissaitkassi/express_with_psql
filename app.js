const express = require('express')
const database=require('./db')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

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

app.get('/users',database.getUsers)
app.get('/user/:id',database.getUsersById)
app.post('/user',database.createUser)
app.put('/users/:id',database.updateUser)
app.delete('/users/:id',database.deleteUser)


