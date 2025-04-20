import knex from 'knex';
import fetch from 'cross-fetch';

const d1Config = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
    async query({sql, bindings}){
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_Account_ID}/d1/database/${process.env.CF_DB_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sql,
            params: bindings
          })
        }
      );
      const data = await response.json();
      return data.result;
    }
  },
  useNullAsDefault: true
}

const localConfig = {
  client: 'sqlite3',
  connection: {
    filename: './src/db.sqlite3'
  }
}

const config = process.env.NODE_ENV == 'production' ? d1Config : localConfig;
const connectedKnex = knex(config);

export default connectedKnex;
// module.exports = connectedKnex;