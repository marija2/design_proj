// var pg = require('pg')

// var connectionString = "postgres://newuser:password@localhost:5432/postgres";

// var pgClient = new pg.Client(connectionString);

// pgClient.connect();

var express = require('express')

const bodyParser = require("body-parser")

var app = express()
var port = process.env.PORT || 3001


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/login", (req, res) => {
  // sql = 'SELECT FROM test WHERE username= AND password= RETURNING *'

  //   const values = ['test_user']
  
  //   // callback
  //   pgClient.query(text, values, (err, res) => {
  //       if (err) {
  //         console.log(err.stack)
  //       } else {
  //         console.log(res.rows[0])
  //       }
  //     })
  console.log(req.body)

  res.json({success: true})
})

app.listen(port)
