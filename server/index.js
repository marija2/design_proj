var pg = require('pg')
var connectionString = "postgres://newuser:password@127.0.0.1:5432/postgres";

var pgClient = new pg.Client(connectionString);
pgClient.connect();

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
app.post('/addStudent', (req, res) => {
  text = 'INSERT INTO student (email, password, first_name, last_name, university, academic_year, major) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
  values = [
    req.body.email,
    req.body.password,
    req.body.first_name,
    req.body.last_name,
    req.body.university,
    req.body.academic_year,
    req.body.major
  ]

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
      res.json({
        success: false
      })
    } else {
      if (res_from_db.rows.length == 1) {
        res.json({
          success: true,
          result: res_from_db.rows[0]
        })
      } else {
        res.json({
          success: false
        })
      }
    }
  }) 
});

app.post('/admin/login',(req,res) => {
  // check if user with this email and password exists
  text = 'SELECT * FROM admin WHERE email = $1 AND password = $2'
  values = [req.body.email, req.body.password]

  console.log(req.session)
  console.log(req.session.username)

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res_from_db.rows.length == 1) {
        req.session.username = req.body.email;

        // return res to client
        res.json({
          success: true,
          result: res_from_db.rows[0]
        })
      } else {
        res.json({
          success: false
        })
      }
    }
  }) 
});

app.post('/login',(req,res) => {
  // check if user with this email and password exists
  text = 'SELECT email FROM student WHERE email = $1 AND password = $2'
  values = [req.body.email, req.body.password]

  console.log(req.session)
  console.log(req.session.username)

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res_from_db.rows.length == 1) {
        req.session.username = req.body.email;

        res.json({
          success: true,
          result: res_from_db.rows[0]
        })
      } else {
        res.json({
          success: false
        })
      }
    }
  }) 
});

app.get('/',(req,res) => {
  let sess = req.session;
  if(sess.username) {
      return res.json({success: true});
  }
  res.json({success: true});
});

app.post('/session', (req, res) => {

  console.log(req.session)
  console.log(req.session.username)

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

app.post('/profile', (req, res) => {
   text = 'SELECT * FROM student WHERE email = $1'
   values = [req.body.email]
 
   pgClient.query(text, values, (err, res_from_db) => {
     if (err) {
       console.log(err.stack)
     } else {
       if (res_from_db.rows.length == 1) {
         editable = false;
  
         if (req.session.username == res_from_db.rows[0].email) {
            editable = true;
         }

         text = 'SELECT * FROM friends WHERE friend1 = $1 OR friend2 = $1'
         values = [res_from_db.rows[0].id]
 
         // find that student's friends
         pgClient.query(text, values, (err, friend_list) => {
           if (err) {
             console.log(err.stack)
           } else {
             // return res to client
             res.json({
               success: true,
               result: res_from_db.rows[0],
               friends: friend_list.rows,
               editable: editable
             })
           }
         })
       } else {
         res.json({
           success: false
         })
       }
     }
   }) 
})

app.post('/editProfile', (req, res) => {
  // get which profile we are modifying the data for and new data
  // push data to database
  // return data to client
  text = 'UPDATE student SET first_name = $1, last_name = $2, prefered_name = $3, pronouns = $4, university = $5, academic_year = $6, major = $7 WHERE email = $8 RETURNING *'
  values = [
    req.body.first_name,
    req.body.last_name,
    req.body.preferred_name,
    req.body.pronouns,
    req.body.university,
    req.body.academic_year,
    req.body.major,
    req.body.email
  ]

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res_from_db.rows.length == 1) {
        // return res to client
        res.json({
          success: true,
          result: res_from_db.rows[0]
        })
      } else {
        res.json({
          success: false
        })
      }
    }
  }) 
})

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) {
        res.json({success: false})
        return
      }
      res.json({success: true})
  });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) {
        res.json({success: false})
        return
      }
      res.json({success: true})
  });
});

app.post('/createTable', (req, res) => {
  text = 'INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING *'
  values = ['mt3786@nyu.edu', 'password']

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res_from_db.rows.length == 1) {
        res.json({
          success: true,
          result: res_from_db.rows[0]
        })
      } else {
        res.json({
          success: false
        })
      }
    }
  }) 
});

app.listen(port)
