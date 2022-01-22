const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
};

async function addUser(user) {
  console.log(user);
  if(db("uuser").where({email: user.email})){
    return;
  }
  return await db("uuser").insert(user);
}

function findAllUsers() {
  return db("uuser");
}
