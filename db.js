require('dotenv').config()
const Pool = require('pg').Pool
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser= require('cookie-parser')
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

const login=(req,res)=>{
    const {email,password}=req.body
    //get users email and pass word if exists 
    pool.query('select * from users where email=$1',[email],(err,results)=>
    {
        // check error for query 
        if(err){
            throw err
        }
        console.log(results.rows.length)
        //check if row count > 0 for a particular user 
        if(results.rows.length!=0){

           
        // when user is found we retrieve the hashed password from db 

           let hashedPasswordFromDb=results.rows[0]['password']
           console.log(hashedPasswordFromDb)
          

            //compare passwords with crypt compare method
            bcrypt.compare(password,hashedPasswordFromDb,(err,isMatch)=>{

                // check for comparison error 
                if(err){
                    throw err
                }

                // when comparison is sucessful  then we check if the passwords are a match 
                if(isMatch){
                    console.log('auth sucess')
                    //use JWT 
                    const user ={ email :email}
                    const accessToken=  jwt.sign(user ,process.env.ACCESS_TOKEN_SECRET)
                    // const serialized =("token",accessToken,{
                    //     httpOnly:true
                    // })
                    res.cookie("token",accessToken,{
                        httpOnly:true
                    })
                    //res.setHeader('Set-Cookie', serialized);
                    res.json({"accessToken":accessToken})

                }else{
                   
                    
                      console.log('invalid credientials')
                   res.status(409).json({"message":"invalid credientials"})
                    

                }

            })
        }
    })
    


}
//jwt middleware 

function authenticatToken(req,res,next){
    const token=req.cookies.token
    console.log(token)
    //console.log('these are headers')
  
    if(token == null) res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>
    {
        if(err) 
        console.log('error verifying token')
        //return res.sendStatus(403)
        req.user=user
        next()
  
    })
  }

const createUser=(req,res)=>{
    const {email,password}=req.body
    // verify if user exist 
    pool.query('SELECT * FROM users where email=$1',[email],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).json(results.rows)
        if(results.rows.length==0){
            // query db if returns 0 rows then insert else don't insert 
            bcrypt.hash(password,10,(err,hash)=>{
                if(err){
                    throw err
                }
                pool.query('INSERT INTO users(email,password)  VALUES ($1,$2) RETURNING *',[email,hash],(err,results)=>
                {
                    if (err){
                        throw err
                    }
                    res.status(201).send(`user added with user_id=${results.rows[0].user_id}`)
                }
            )
            })
            
        }else{
            res.status(409).send('user already exist')
        }
    })  
 }
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

const getUsersByName=(req,res)=>{
  

    const keyword=req.params.email
    pool.query("select * from users where email like $1 ",[`%${keyword}%`],(err,results)=>{
        if(err){
            throw err
        }
        res.status(200).send(results.rows)
    })
}

  module.exports = {
    getUsers,
    getUsersById,
    createUser,  
    updateUser,
    deleteUser,
    getUsersByName,
    login,
    authenticatToken
  }