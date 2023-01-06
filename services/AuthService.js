const users = require('../models/user');
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

async function signup(cred){
    console.log("hey");
    let user = {}
    user.email = cred.email
    user.password = cred.password
    user.username = cred.username
    return await users.addNewUser(user)
}
async function login(cred){
    console.log("hey");
    let user = {}
    user.email = cred.email
    user.password = cred.password
    user.username = cred.username
    let res = await users.login(user)
    if(res){
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
          time: Date(),
          userId: res.id
        }
        const token = jwt.sign(data, jwtSecretKey, {
          expiresIn : '7d'
        });
        return token
    }
    return false
}
module.exports = {
    signup,
    login
}