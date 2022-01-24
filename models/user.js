const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints
};

function exists(){
  return db("uuser").where({email: user.email}).select();
}

 function addUser(user) {
  console.log(user);
  exists().then(user =>{
    if(!user){
       db("uuser").insert(user);
    }
  })
}

function findAllUsers() {
  return db("uuser");
}

function findAllSortByPoints(){
  return db("uuser").select().orderBy('points', 'desc');
}
