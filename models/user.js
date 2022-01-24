const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
  findAllSortByPoints
};

async function addUser(user) {
  console.log(user);
  let gg = db("uuser").where({email: user.email}).select();
  gg.then(user =>{
    if(!user){
      await db("uuser").insert(user);
    }
  })
}

function findAllUsers() {
  return db("uuser");
}

function findAllSortByPoints(){
  return db("uuser").select().orderBy('points', 'desc');
}
