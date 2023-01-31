const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
var flash = require('connect-flash');
var wordd = require('./models/word');
const sessions = require('express-session');
const users = require('./models/user');
const passport = require("passport");
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const AuthRouter = require('./routes/AuthRoutes');
const MainRoutes = require('./routes/MainRoutes')
const LeaderboardRoutes = require('./routes/LeaderboardRoutes')
const checkLogin = require('./middlewares/login')
const cookieParser = require("cookie-parser");
var cron = require('node-cron');



const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(flash());
app.use(express.json());
app.use(express.static('public/imgs'));
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

/*
*this cron job is to update online users and check if they are still there
*/
cron.schedule('*/10 * * * * *', () => {
    console.log('CRON JOB STARTED! ');
    users.setToOffline()
    console.log('CRON JOB ENDED! ');
});

app.listen(PORT, () => console.log(`Server is UP and running on ${ PORT }`))


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

/* this end point will be used to refresh the user every second like updating the online
* status and checking if the word has been solved and more ...
*/
app.get('/refresh/:id', checkLogin.isLoggedin , async (req, res) => {
    if(req.user_data != null){
        //refresh the online status to YES
        await users.updateStatus(req.user_data.userId, 1);
        
        //check the word if it is solved
        let word_solved = false;
        let word = await wordd.word.getById(req.params['id'])
        if(word[0].solvedOn != '-'){
            console.log("the word with id is solved");
            word_solved = true;
        }else{
            console.log("the word IS NOT solved yet");
        }
        //check for online people number
        let num = await users.numberOfOnlineUsers();
        res.send({
            solved : word_solved,
            numOnline : num
        })
    }else{
      console.log("user is not logged in");
      res.send("you should be logged in")
    }
})
app.get("/solved", (req, res) => {
  res.render('solved');
})

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
      res.send('user not authenticated to use this method (hidding)');
  }
})