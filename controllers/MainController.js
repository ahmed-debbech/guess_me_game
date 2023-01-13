const wordd = require('../models/word')
const users = require('../models/user')
const utils = require('../utils')

async function root(req, res, next){
    try {
        console.log(req.user_data);
        var colors = req.flash("colors");
        var yourword = req.flash("yourword");
        var won = req.flash("won");
        let auth = false;
        let loguser = {};
        let word = await wordd.word.getCurrent()
        console.log(word)
        if(word.length == 0) return;
        let wordy = word[0].name;
        if(req.user_data != null){
            console.log("he is logged");
            auth = true;
            loguser = await users.getUserById(req.user_data.userId)
            console.log(loguser);
            
            if(colors.length == 0 && !yourword){
                res.render('index',
                {
                word_id :word[0].id,
                length : wordy.length,
                logUser : loguser,
                auth : true,
                colors: null,
                yourword : null,
                won: won
                })
            }else{
                res.render('index', 
                {
                word_id :word[0].id,
                length : wordy.length,
                logUser : loguser,
                auth : true,
                colors: colors,
                yourword : yourword[0],
                won: won
                })
            }
        }else{
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
        }
    } catch (err) {
        console.error("[error in loading service]", err.message);
    }
}
async function process(req, res, next){
    try {
        console.log("[USER] " + req.user_data.userId + " is trying with the word '" + req.body + "' ...")
        
        let word = await wordd.word.getCurrent()
        if(word.length == 0) return; // no word found in the database
    
        //console.log(word[0].name)
        let wordy = word[0].name.toLowerCase();
        let colors = new Array(wordy.length) // 3 green 2 orange 1 grey
    
        const clientWord = req.body.pass.toLowerCase();
        if(clientWord.length != wordy.length){
            res.send('not ' +wordy.length+ ' caracters! go back <-')
        }
        if(wordy == clientWord){
            console.log("USER WITH ID : " + req.user_data.userId + " GUESSED THE RIGHT WORD");
            let score = wordy.length;
            users.updateScore(req.user_data.userId, score)
            .then(user =>{
                console.log("updated score successfully")
                wordd.word.newWord();
                req.flash("yourword", score);
                req.flash("won", "true")
                req.flash("length", score)
                req.flash("logUser", req.user_data);
                res.redirect('/winner');
            }).catch(err => {
                console.log(err);
            })
        }else{
            colors = utils.checkWord(clientWord, wordy);
        }
        req.flash("yourword", clientWord);
        req.flash("colors", colors)
        res.redirect('/');
    } catch (err) {
        console.error("[error in loading service]", err.message);
    }
}
module.exports = {
    root,
    process
}