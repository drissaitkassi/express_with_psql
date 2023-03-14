const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
})


const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


const getUsersById=(req,res)=>{
    const id =req.params.id
    pool.query('SELECT * FROM users where user_id=$1',[id],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json(results.rows)
    })
}

const createUser=(req,res)=>{
    const {user_id,name,age}=req.body
    pool.query('INSERT INTO users(user_id,name,age)  VALUES ($1,$2,$3) RETURNING *',[user_id,name,age],(err,results)=>
    {
        if (err){
            throw err
        }
        res.status(201).send(`user added with user_id=${results.rows[0].user_id}`)
    }
)}


const updateUser=(req,res)=>{
    const id =req.params.id
    const {user_id,name,age}=req.body
    pool.query('UPDATE users SET user_id=$1,name=$2,age=$3 where user_id=$1',[id,name,age],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).send(`user with id : ${id} is modified `)
    })
}

const deleteUser=(req,res)=>{
    const id=req.params.id
    pool.query('DELETE FROM users WHERE user_id=$1',[id],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).send(`user with id : ${id} is deleted `)
    })
}

  module.exports = {
    getUsers,
    getUsersById,
    createUser,  
    updateUser,
    deleteUser,
  }