const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints
};

async function addUser(user) {
  console.log(user);
  db("uuser").where({email: user.email})
  .then(use => {
    if(use.email == user.email){
      console.log("201 user added")
      await db("uuser").insert(user);
    }
  })
  .catch(error =>{
    console.log("could not add new user")
  })
}

function findAllUsers() {
  return db("uuser");
}

function findAllSortByPoints(){
  return db('uuser').select().orderBy('points', 'desc');
}
