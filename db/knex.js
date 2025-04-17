import knex from 'knex';

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename: process.env.NODE_ENV === 'production'
    ? "/tmp/db.sqlite3"
    : "./src/db.sqlite3"
  }
});

export default connectedKnex;
// module.exports = connectedKnex;