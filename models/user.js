const db = require("../knex/knex.js");

module.exports = {
  addUser,
  findAllUsers,
};

async function addUser(user) {
  console.log(user);
  return await db("user").insert(user);
}

function findAllUsers() {
  return db("user");
}
