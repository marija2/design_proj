var pg = require('pg')

var connectionString = "postgres://newuser:password@localhost:5432/postgres";

var pgClient = new pg.Client(connectionString);

pgClient.connect();

const text = 'INSERT INTO test(name) VALUES($1) RETURNING *'

const values = ['test_user']

// callback
pgClient.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      console.log(res.rows[0])
    }
  })