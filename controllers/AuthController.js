const AuthService = require('../AuthService.js');


async function signup(req, res, next) {
    try {
        //res.json(await AuthService.signup(req.query.page));
        console.log("email : " + req.body.email + "password : " +
        req.body.password + " username : " + req.body.username );
    } catch (err) {
        console.error("[error in loading service]", err.message);
    }
}
  
module.exports = {
    signup
}