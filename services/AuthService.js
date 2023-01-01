const users = require('../models/user');

function signup(cred){
    console.log("hey");
    let user = {}
    user.email = cred.email
    user.password = cred.password
    user.name = cred.username
    return users.addNewUser(user)
}

module.exports = {
    signup
}