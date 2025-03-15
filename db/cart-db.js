import knex from './knex.js';

function getCart(userId){
  return knex('carts').select('id', 'userid', 'purchased', 'order').where('userid', userId).where('purchased', 0).first();
}

function addToCart(userId, order){
  return knex('carts').where('userid', userId).insert({
    'order': order,
    'userid': userId,
    'purchased': 0,
  });
}

function purchaseCart(userId){
  return knex('carts').where('userid', userId).update({
    'purchased': 1,
    'userid': userId,
  });
}

function deleteCart(userId){
  return knex('carts').where('userid', userId).where('purchased', 0).del();
}

function updateCart(userId, order){
  return knex('carts').where('userid', userId).where('purchased', 0).update({'order': order});
}

export default {
  getCart,
  addToCart,
  purchaseCart,
  deleteCart,
  updateCart,
}