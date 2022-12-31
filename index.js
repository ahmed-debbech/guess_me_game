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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  secret: "thisismysecrctekey",
  saveUninitialized:true,
  cookie: { "name": "master" },
  resave: false
}));
/*
app.use(passport.initialize());
app.use(passport.session());
console.log(process.env.FACEBOOK_ID);
passport.use(
  new fbStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_DOMAIN,
      profileFields: ["email", "name", "photos"]
    },
    function(accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name, picture } = profile._json;
      console.log(profile._json)
      const userData = {
        email : email,
        name: first_name + " " + last_name,
        photoLink : picture.data.url
      };
      console.log("inside strategy :")
      console.log(userData);
      users.addUser(userData)
      done(null, profile);
    }
  )
);*/
app.set('views', __dirname + '/views/pages');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

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
app.get('/', (req, res) => {
  
  var colors = req.flash("colors");
  var yourword = req.flash("yourword");
  var won = req.flash("won");
  //console.log("params: " + colors + " | " + yourword);
  let auth = false;
  let loguser = {};
  wordd.word.getCurrent().then(word => {
    if(word.length == 0) return;
    let wordy = word[0].name;
      console.log("user is not logged in")
      if(colors.length == 0 && !yourword){
        res.render('index',
        {
          word_id :word[0].id,
          length : wordy.length,
          logUser : loguser,
          auth,
          colors: null,
          yourword : null,
          won: won
        })
      }else{
        var cc = yourword;
        res.render('index', 
        {
          word_id :word[0].id,
          length : wordy.length,
          logUser : loguser,
          auth,
          colors: colors,
          yourword : cc[0],
          won: won
        })
      }
    
})
})
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
  var yourword = req.flash("yourword");
  var won = req.flash("won")
  var logUser = req.flash("logUser");

  res.render('won',
  {
    length,
    logUser,
    yourword,
    won
  });
})
app.get('/done/:id', (req, res) => {
    //console.log("checking if word is solved");
    if(req.isAuthenticated()){
      wordd.word.getById(req.params['id']).then(word => {
        //console.log( word[0]);
        if(word[0].solvedOn != '-'){
          console.log("the word with id is solved");
          res.send("1");
        }else{
          console.log("the word IS NOT solved yet");
        }
      })
    }
})
app.get("/solved", (req, res) => {
  res.render('solved');
})
app.post('/process', function(req, res){
  console.log("word came from user: ");
  console.log(req.body);

  if(req.isAuthenticated()){
    console.log("[USER] " + req.user._json.first_name + " " + req.user._json.last_name + " is trying ...")
    
    users.isLimited(req.user._json.email).then(uuser =>{
      wordd.word.getCurrent().then(word => {
      if(word.length == 0) return;

      //console.log(word[0].name)
      let wordy = word[0].name.toLowerCase();
      let colors = new Array(wordy.length) // 3 green 2 orange 1 grey

      const clientWord = req.body.pass.toLowerCase();
      if(clientWord.length != wordy.length){
        res.send('not ' +wordy.length+ ' caracters! go back <-')
      }
      if(wordy == clientWord){
        //great job
        console.log("good job");
        fs.appendFileSync('logs', 'SOMEONE GUESSED THE RIGHT WORD\n');
        let score = 0;
        if(uuser.length == 0){
          score = 100
        }else{
          score = wordy.length;
        }
        users.updateScore(req.user._json.email, score).then(user =>{
          console.log("updated successfully")
          wordd.word.newWord();
          req.flash("yourword", score);
          req.flash("won", "true")
          if(uuser.length == 0){
            req.flash("length", 100)
          }else{
            req.flash("length", score)
          }
          req.flash("logUser", req.user._json);
          res.redirect('/winner');
        }).catch(err => {
          console.log(err);
        })
      
      }else{
        fs.appendFileSync('logs', 'Someone guessed : ' + clientWord + "\n");
        colors = utils.checkWord(clientWord, wordy);
        //console.log(colors);
      }
      req.flash("yourword", clientWord);
      req.flash("colors", colors)
      res.redirect('/');
      })
    })
  }

});
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
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
app.get('/leaderboard', (req, res) => {
  let auth = false;
  let logUser = null;
  if(req.isAuthenticated()){
    auth = true;
    logUser = req.user._json;
  }

  let people = null;
  users.findAllSortByPoints()
  .then(user => {
    people = user;
    //console.log(people);
    res.render('leaderboard',{
      people,
      auth,
      logUser
    })
  })
  .catch(error =>{
    console.log("couldnt retrieve users to leaderboard page")
    people = null;
  })
})
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