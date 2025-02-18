import knex from './knex.js';

function getCart(id){
  return knex('carts').where('id', id).select('*');
}

function addToCart(order){
  return knex('carts').insert(order);
}

function deleteCart(id){
  return knex('carts').where('id', id).del();
}

function updateCart(id, order){
  return knex('carts').where('id', id).update(order);
}

export default {
  getCart,
  addToCart,
  deleteCart,
  updateCart,
}