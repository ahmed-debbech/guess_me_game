const express = require('express')
const fs = require('fs');
const path = require('path')
let ejs = require('ejs');
var flash = require('connect-flash');
var word = require('./word');
const sessions = require('express-session');
const PORT = process.env.PORT || 5000

const app = express()
app.use(flash());
app.use(sessions({
  secret: "thisismysecrctekey",
  saveUninitialized:true,
  cookie: { "name": "master" },
  resave: false
}));

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
  

  app.get('/process/:word', function(req, res){
    console.log("word: " + req.params.word);

    let colors = new Array(10) // 3 green 2 orange 1 grey

    const clientWord = req.params.word.toLowerCase();
    if(clientWord.length != 10){
      res.send('not 10 caracters! go back <-')
    }
    if(word.word == clientWord){
      //great job
      console.log("good job");
      fs.appendFileSync('logs', 'SOMEONE GUESSED THE RIGHT WORD\n');
      req.flash("yourword", clientWord);
      req.flash("won", "true")
      res.redirect('/');
    }else{
      fs.appendFileSync('logs', 'Someone guessed : ' + clientWord + "\n");
      for(var i =0; i<=clientWord.length-1; i++){
        if(clientWord[i] == word.word[i]){
          colors[i] = 3;
        }
      }
      for(var i=0; i<=word.word.length-1; i++){
        if(colors[i] != 3){
          for(var j=0; j<=clientWord.length-1; j++){
            if(j != i && colors[j] != 3 && clientWord[j] == word.word[i]){
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