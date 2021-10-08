var pg = require('pg')
console.log("in server.js")
var express = require('express')

var app = express()
var port = process.env.PORT || 3001

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

var server = app.listen(port)

// app.use(express.static('client'))

// var socket = require('socket.io')

// var io = socket(server)

// io.sockets.on('connection', newConnection)

// function newConnection(socket) {
//   console.log("new conn")

//   var connectionString = "postgres://newuser:password@localhost:5432/postgres";

//   var pgClient = new pg.Client(connectionString);

//   pgClient.connect();

//   const text = 'INSERT INTO test(name) VALUES($1) RETURNING *'

//   const values = ['test_user']

//   // callback
//   pgClient.query(text, values, (err, res) => {
//       if (err) {
//         console.log(err.stack)
//       } else {
//         console.log(res.rows[0])
//       }
//     })
// }