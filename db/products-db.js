import knex from './knex.js';

function getAllProducts() {
  return knex('products').select('*');
}

function getProductById(id){
  return knex('products').where('id', id).select('*');
}

function getProductByPrice(acsORdesc){
  return knex('products').orderBy('price', acsORdesc);
}

function addProduct(product) {
  return knex('products').insert(product);
}

function updateProduct(id, product) {
  return knex('products').where('id', id).update(product);
}

export default {
  getAllProducts,
  getProductById,
  getProductByPrice,
  addProduct,
  updateProduct,
}