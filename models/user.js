const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints
};

function exists(user){
  return db("uuser").where({email: user.email});
}

function addUser(useer) {
  exists(useer).then(async (user) =>{
    if(user.length == 0){
      return await db("uuser").insert(useer);
    }
  })
}

function findAllUsers() {
  return db("uuser");
}

function findAllSortByPoints(){
  return db("uuser").select().orderBy('points', 'desc');
}
