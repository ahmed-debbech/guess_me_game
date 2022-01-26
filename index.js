const express = require('express')
const fs = require('fs');
const path = require('path')
let ejs = require('ejs');
const bodyParser = require('body-parser')
var flash = require('connect-flash');
var word = require('./models/word');
const sessions = require('express-session');
const users = require('./models/user');
const passport = require("passport");
const strategy = require("passport-facebook");
const fbStrategy = strategy.Strategy;

const PORT = process.env.PORT || 5000

const app = express()

app.use(flash());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
  secret: "thisismysecrctekey",
  saveUninitialized:true,
  cookie: { "name": "master" },
  resave: false
}));
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
      const userData = {
        email,
        name: first_name + " " + last_name,
        photoLink : picture.data.url
      };
      console.log(userData);
      users.addUser(userData)
      done(null, profile);
    }
  )
);

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

app.get('/t', (req, res) => {
  word.word.newWord();
})

app.get('/', (req, res) => {
  
  var colors = req.flash("colors");
  var yourword = req.flash("yourword");
  var won = req.flash("won");
  console.log("params: " + colors + " | " + yourword);
  let auth = false;
  let loguser = {};
  word.word.getCurrent().then(word => {
    if(word.length == 0) return;
    let wordy = word[0].name;
  if(req.isAuthenticated()){
    auth = true;
    users.findUserByEmail(req.user._json.email).then(user => {
      if(Object.keys(user[0]).length != 0){
        loguser = req.user._json;
        loguser.hidden = user[0].hidden;
        
        console.log("User is logged in and email is found " );
        console.log(loguser);
        if(colors.length == 0 && !yourword){
          res.render('index',
          {
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
            length : wordy.length,
            logUser : loguser,
            auth,
            colors: colors,
            yourword : cc[0],
            won: won
          })
        }
      }else{
        console.log("User is logged in but email is not found")
        if(colors.length == 0 && !yourword){
          res.render('index',
          {
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
            length : wordy.length,
            logUser : loguser,
            auth,
            colors: colors,
            yourword : cc[0],
            won: won
          })
        }
      }
    })
  }else{
    console.log("user is not logged in")
    if(colors.length == 0 && !yourword){
      res.render('index',
      {
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
        length : wordy.length,
        logUser : loguser,
        auth,
        colors: colors,
        yourword : cc[0],
        won: won
      })
    }
  }
})
})
app.get('/xds/:pass', function(req, res){
  console.log("pass: " + req.params.pass);

  if(req.params.pass == "ahmeds4s4"){
    word.word.getCurrent().then(word => {
      res.send(word);
    })
  }else{
    res.send("Failed")
  }
});
app.post('/user', (req,res)=> {
  console.log(req.body);
  users.addUser(req.body)
  .then(user => {
    res.status(201).json(user);
  })
  .catch(error =>{
    res.status(500).json({message : "could not add new user"})
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
app.post('/process', function(req, res){
  console.log("word: " + req.body);
  if(req.isAuthenticated()){
  word.word.getCurrent().then(word => {
    if(word.length == 0) return;

  console.log(word[0].name)
  let wordy = word[0].name;
  let colors = new Array(wordy.length) // 3 green 2 orange 1 grey

  const clientWord = req.body.pass.toLowerCase();
  if(clientWord.length != wordy.length){
    res.send('not ' +wordy.length+ ' caracters! go back <-')
  }
  if(wordy == clientWord){
    //great job
    console.log("good job");
    fs.appendFileSync('logs', 'SOMEONE GUESSED THE RIGHT WORD\n');
    users.updateScore(req.user._json.email, wordy.length).then(user =>{
      console.log("updated successfully")
      word.word.newWord();
      req.flash("yourword", clientWord);
      req.flash("won", "true")
      res.redirect('/');
    }).catch(err => {
      console.log(err);
    })
  
  }else{
    fs.appendFileSync('logs', 'Someone guessed : ' + clientWord + "\n");
    for(var i =0; i<=clientWord.length-1; i++){
      if(clientWord[i] ==wordy[i]){
        colors[i] = 3;
      }
    }
    for(var i=0; i<=wordy.length-1; i++){
      if(colors[i] != 3){
        for(var j=0; j<=clientWord.length-1; j++){
          if(j != i && colors[j] != 3 && clientWord[j] == wordy[i]){
            colors[j] = 2;
          }
        }
      }
    }
    for(var i=0; i<=colors.length-1; i++){
      if(colors[i] != 3 && colors[i] != 2){
        colors[i] = 1;
      }
    }
    console.log(colors);
  }
  req.flash("yourword", clientWord);
  req.flash("colors", colors)
  res.redirect('/');
  })
  }

});
app.get("/auth/fb", passport.authenticate("facebook"));
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
    console.log("201 added")
    people = user;
    console.log(people);
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