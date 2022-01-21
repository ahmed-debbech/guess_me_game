const express = require('express')
const fs = require('fs');
const path = require('path')
let ejs = require('ejs');
const bodyParser = require('body-parser')
var flash = require('connect-flash');
var word = require('./word');
const sessions = require('express-session');
const users = require('./models/user');
const dbPost = require('./postgresInit');
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

//dbPost.init();

app.get('/', (req, res) => {
  var colors = req.flash("colors");
  var yourword = req.flash("yourword");
  var won = req.flash("won");
  console.log("params: " + colors + " | " + yourword);
  if(colors.length == 0 && !yourword){
    res.render('index',
    {
      colors: null,
      yourword : null,
      won: won
    })
  }else{
    var cc = yourword;
  res.render('index', 
  {
    colors: colors,
    yourword : cc[0],
    won: won
  })
  }
})

app.set('views', __dirname + '/views/pages');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


app.post('/xds/:pass/', function(req, res){
  console.log("pass: " + req.params.pass);
  console.log("new word: " + req.body.newword);

  if(req.params.pass == "ahmeds4s4"){
    word.word.name = req.body.newword;
    res.send("sucess");
  }else{
  res.send("Failed")
  }
});
app.get('/xds/:pass', function(req, res){
  console.log("pass: " + req.params.pass);

  if(req.params.pass == "ahmeds4s4"){
    res.send(word.word.name);
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

  let colors = new Array(10) // 3 green 2 orange 1 grey

  const clientWord = req.body.pass.toLowerCase();
  if(clientWord.length != 10){
    res.send('not 10 caracters! go back <-')
  }
  if(word.word.name == clientWord){
    //great job
    console.log("good job");
    fs.appendFileSync('logs', 'SOMEONE GUESSED THE RIGHT WORD\n');
    word.word.name = word.word.newWord();
    req.flash("yourword", clientWord);
    req.flash("won", "true")
    res.redirect('/');
  }else{
    fs.appendFileSync('logs', 'Someone guessed : ' + clientWord + "\n");
    for(var i =0; i<=clientWord.length-1; i++){
      if(clientWord[i] == word.word.name[i]){
        colors[i] = 3;
      }
    }
    for(var i=0; i<=word.word.name.length-1; i++){
      if(colors[i] != 3){
        for(var j=0; j<=clientWord.length-1; j++){
          if(j != i && colors[j] != 3 && clientWord[j] == word.word.name[i]){
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




});