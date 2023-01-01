const AuthService = require('../services/AuthService');
const utils = require('../utils')

async function signup(req, res, next) {
    try {
        //res.json(await AuthService.signup(req.query.page));
        console.log("email : " + req.body.email + "password : " +
        req.body.password + " username : " + req.body.username );
        if(req.body.email == '' || req.body.username == '' || req.body.password == ''){
            res.json('please make sure that you fill all fields')
            return
        }
        if(!utils.validateEmail(req.body.email)){
            res.json('Please set a valid email!')
            return
        }
        let creds = {email : req.body.email, username: req.body.username, password: req.body.password}
        if(await AuthService.signup(creds) == true){
            res.redirect('/')
        }else{
            res.json('could not add new user; maybe username is already taken')
        }
    } catch (err) {
        console.error("[error in loading service]", err.message);
    }
}
  
module.exports = {
    signup
}