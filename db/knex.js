import knex from 'knex';

const connectedKnex = knex({
  client: "sqlite3",
  connection: {
    filename: "./src/db.sqlite3"
  }
});

export default connectedKnex;
// module.exports = connectedKnex;