const express = require('express')
const fs = require('fs');
const path = require('path')
let ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser')
var flash = require('connect-flash');
var wordd = require('./models/word');
const sessions = require('express-session');
const users = require('./models/user');
const utils = require('./utils')
const passport = require("passport");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const AuthRouter = require('./routes/AuthRoutes');
const MainRoutes = require('./routes/MainRoutes')
const LeaderboardRoutes = require('./routes/LeaderboardRoutes')
const checkLogin = require('./middlewares/login')
const cookieParser = require("cookie-parser");

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
opts.secretOrKey = 'secret';
opts.issuer = 'guessme2022.herokuapp.com/';
opts.audience = 'https://guessme2022.herokuapp.com/';

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log("the email from payload: " + jwt_payload);
  users.findUserByEmail(jwt_payload.sub).then(user => {
      if (user.length != 0) {
        console.log("they exist")
        return done(null, user[0]);
      } else {
        console.log("they dont exist")
        return done(null, false);
      }
  });
}));

const strategy = require("passport-facebook");

const fbStrategy = strategy.Strategy;

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(flash());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  secret: "thisismysecrctekey",
  saveUninitialized:true,
  cookie: { "name": "master" },
  resave: false
}));
app.set('views', __dirname + '/views/pages');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
app.use('/ath', AuthRouter);
app.use('/', MainRoutes);
app.use('/', LeaderboardRoutes);

app.listen(PORT, () => console.log(`Server is UP and running on ${ PORT }`))

app.get('/xds', (req, res) => {
  wordd.word.newWord();
})
app.get('/xds/:pass', function(req, res){
  console.log("pass: " + req.params.pass);

  if(req.params.pass == "ahmeds4s4"){
    wordd.word.getCurrent().then(word => {
      res.send(word);
    })
  }else{
    res.send("Failed")
  }
});

app.get('/user', (req,res)=> {
  users.findAllUsers()
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error =>{
    res.status(500).json({message : "no user could be retrieved"})
  })
})
app.get('/winner', (req, res) => {
  var length = req.flash("length");
  let clientWord = req.flash("yourword")
  var won = req.flash("won")
  var logUser = req.flash("logUser");
  res.render('won',
  {
    length,
    logUser,
    yourword  : clientWord[0],
    won
  });
})
app.get('/done/:id', checkLogin.isLoggedin , (req, res) => {
    //console.log("checking if word is solved");
    if(req.user_data != null){
      wordd.word.getById(req.params['id']).then(word => {
        //console.log( word[0]);
        if(word[0].solvedOn != '-'){
          console.log("the word with id is solved");
          res.send("1");
        }else{
          console.log("the word IS NOT solved yet");
        }
      })
    }else{
      console.log("user is not logged in");
    }
})
app.get("/solved", (req, res) => {
  res.render('solved');
})

app.get("/auth/fb", passport.authenticate("facebook", {scope: ["email"]}));
//app.get("/auth/fb", () => {console.log("logged in")});
app.get("/auth/fb/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/success",
    failureRedirect: "/auth/fail"
  })
);
app.get("/auth/fail", (req, res) => {
  res.render("failed");
});
app.get("/auth/success", (req, res) => {
  res.redirect("/");
});
app.get('/logout', checkLogin.isLoggedin ,function(req, res){
  res.clearCookie("token");
  res.redirect('/');
});
app.get('/hide/:status', (req, res) => {
  if(req.isAuthenticated()){
    let email = req.user._json.email;
    let status  = req.params['status'];
    console.log("email  " + email + " status " + status);
    let user = {email : email}
    users.makeHidden(status, user).then(user => {
      console.log("success hidden")
    }).catch(err =>{
      console.log("an error occured while hidding user ")
    })
    res.redirect('/')
  }else{
    console.log("user not authenticated to use this method (hidding)")
  }
})