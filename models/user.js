const { use } = require("passport");
const db = require("../knex/knex.js");
const utils = require('../utils')
const bcrypt = require('bcrypt')

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints,
  makeHidden,
  findUserByEmail,
  updateScore,
  isLimited,
  addNewUser
};

function isLimited(email){
  return db("uuser").where({email: email, limited: 1});
}
function exists(user){
  return db("uuser").where({email: user.email});
}
function addNewUser(useer) {
  exists(useer).then(async (user) =>{
    if(user.length == 0){
      useer.hidden = 0;
      useer.points = 0;
      useer.activated = 1; //to be checked first (but not now!)
      useer.limited = 0
      useer.solvedWords = 0
      const hashedPassword = await bcrypt.hash(useer.password, 10)
      useer.password = hashedPassword
      return db("uuser").insert(useer);
    }
  })
  return true;
}
function addUser(useer) {
  exists(useer).then(async (user) =>{
    if(user.length == 0){
      useer.hidden = 0;
      return await db("uuser").insert(useer);
    }
  })
}
async function updateScore(emailString, points){
  return await db("uuser").where({email: emailString}).increment({'points': points ,'solvedWords': 1});
}
function findUserByEmail(email){
  return db("uuser").where({email : email}).select();
}
function findAllUsers() {
  return db("uuser");
}

function findAllSortByPoints(){
  return db("uuser").select().orderBy('points', 'desc');
}

async function makeHidden(val, user){
    if(val == 1){
      return await db("uuser").where({email: user.email}).update({hidden : "1"})
    }else{
      return await db("uuser").where({email: user.email}).update({hidden : "0"})
    }
}
