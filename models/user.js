const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints,
  makeHidden,
  findUserByEmail
};

function exists(user){
  return db("uuser").where({email: user.email});
}

function addUser(useer) {
  exists(useer).then(async (user) =>{
    if(user.length == 0){
      useer.hidden = 0;
      return await db("uuser").insert(useer);
    }
  })
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
  if(user.length != 0 ){ // exists
    if(val == 1){
      return await db("uuser").where({email: user.email}).update({hidden : "1"})
    }else{
      return await db("uuser").where({email: user.email}).update({hidden : "0"})
    }
  }
}
