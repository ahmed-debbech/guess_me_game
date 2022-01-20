const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
};

async function addUser(user) {
  console.log(user);
  return await db("uuser").insert(user);
}

function findAllUsers() {
  return db("uuser");
}
