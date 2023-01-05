const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

function isLoggedin(req,res,next){
    var token = req.cookies.token;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, token_data) {
            if (err) {
                req.user_data = null
            } else {
                req.user_data = token_data;
            }
        });
    } else{
        req.user_data = null
    }
    next()
}
function isLoggedinSimple(req){
    console.log(req);
    var token = ''

    if(token){
        jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, token_data) {
            if (err) {
                return false
            } else {
                return true
            }
        });
    }
    return false
}
module.exports = {
    isLoggedin,
    isLoggedinSimple
}