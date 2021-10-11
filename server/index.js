// var pg = require('pg')
// var connectionString = "postgres://newuser:password@127.0.0.1:5432/postgres";

// var pgClient = new pg.Client(connectionString);
// pgClient.connect();

var express = require('express')
var session = require('express-session')
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const client  = redis.createClient();
const bodyParser = require("body-parser")

var app = express()
var port = process.env.PORT || 3001

app.use(session({
  secret: 'ssshhhhh',
  // create new redis store.
  store: new redisStore({ host: '127.0.0.1', port: 3001, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// if client asks to login
// check if user exists
// app.post("/login", (req, res) => {
//   sql = 'SELECT FROM test RETURNING *'
//   const values = ['test_user']
  
//     // callback
//     pgClient.query(text, values, (err, res_from_db) => {
//         if (err) {
//           console.log(err.stack)
//         } else {
//           // return res to client
//           res.json({
//             success: true,
//             result: res_from_db.rows[0]
//           })
//           // console.log(res_from_db.rows[0])
//         }
//       })  
// })

app.post('/login',(req,res) => {
  req.session.username = req.body.username;
  res.json({success: true})
});

app.get('/',(req,res) => {
  let sess = req.session;
  if(sess.username) {
      return res.json({success: true});
  }
  res.json({success: true});
});

app.post('/session', (req, res) => {
  if (req.session.username) res.json({ success: true })
  else res.json({ success: false })
})

// app.get('/admin',(req,res) => {
//   if(req.session.email) {
//       res.json({success: true});
//   }
//   else {
//     res.json({success: false});
//   }
// });

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) {
        res.json({success: false})
        return
      }
      res.json({success: true})
  });
});

app.listen(port)
