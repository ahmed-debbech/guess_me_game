const wordd = require('../models/word')
const users = require('../models/user')

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

module.exports = {
    root
}