const users = require('../models/user');

async function signup(cred){
    console.log("hey");
    let user = {}
    user.email = cred.email
    user.password = cred.password
    user.username = cred.username
    return await users.addNewUser(user)
}

module.exports = {
    signup
}