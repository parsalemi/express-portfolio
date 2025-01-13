// const knex = require('./knex');
import knex from './knex.js';

function getAllUsers() {
  return knex("users").select("*");
}

function createUser(user) {
  return knex("users").insert(user);
}

function deleteUser(id) {
  return knex("users").where("id", id).del();
}

function updateUser(id, user) {
  return knex("users").where("id", id).update(user);
}
export default {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser
}
// module.exports = {
//   getAllUsers,
//   createUser,
//   deleteUser,
//   updateUser
// }