const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

app.set('db', knex({
  client: 'pg',
  connection: DATABASE_URL
}));

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}.`);
});