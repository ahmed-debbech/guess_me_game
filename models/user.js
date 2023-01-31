const { use } = require("passport");
const db = require("../knex/knex.js");
const utils = require('../utils')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints,
  makeHidden,
  findUserByEmail,
  updateScore,
  isLimited,
  addNewUser,
  login,
  getUserById,
    updateStatus,
    numberOfOnlineUsers
};

function numberOfOnlineUsers(){
    return db("uuser").where({online : 1}).select().count();
}
async function updateStatus(id, isOnline){
    return await db("uuser").where({id: id}).update({'online': isOnline});
}
function getUserById(id){
  return new Promise(resolve => {
    db("uuser").where({id: id})
    .then((us) => {resolve(us[0])})
  });
}
function isLimited(email){
  return db("uuser").where({email: email, limited: 1});
}
function exists(user){
  return new Promise(resolve => {
    db("uuser").where({email: user.email}).orWhere({username: user.username})
    .then((us) => {resolve(us)})
  });
}
async function login(user){
  let u = await exists(user)
  if(u.length == 0) return false;
  let res = await bcrypt.compare(user.password, u[0].password)
  if(res) return u[0]
  return null
}
async function addNewUser(useer) {
  let res = true
  let u = await exists(useer)
  if(u.length == 0){
    useer.hidden = 0;
    useer.points = 0;
    useer.activated = 1; //to be checked first (but not now!)
    useer.limited = 0
    useer.solvedWords = 0
    const hashedPassword = await bcrypt.hash(useer.password, 10)
    useer.password = hashedPassword
    await db("uuser").insert(useer);
    res = true
  }else{
    res = false
  }
  return res;
}
function addUser(useer) {
  exists(useer).then(async (user) =>{
    if(user.length == 0){
      useer.hidden = 0;
      return await db("uuser").insert(useer);
    }
  })
}
async function updateScore(id, points){
  return await db("uuser").where({id: id}).increment({'points': points ,'solvedWords': 1});
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
