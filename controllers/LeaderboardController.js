const wordd = require('../models/word')
const users = require('../models/user')
const utils = require('../utils')
const {findAllUsers} = require("../models/user");


async function leaderboard(req, res, next){
    try {
        let auth = false;
        let logUser = null;
        if(req.user_data != null){
            auth = true;
            logUser = req.user_data.userId;
        }

        let people = null;
        users.findAllSortByPoints()
          .then(async user => {
              people = user;
              //console.log(people);
              logUser = await users.getUserById(req.user_data.userId)
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
    } catch (err) {
        console.error("[error in loading service]", err.message);
    }
}

module.exports = {
    leaderboard
}