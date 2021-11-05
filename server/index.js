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
  store: new redisStore({ host: '127.0.0.1', port: 3001, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/addStudent', (req, res) => {
  text = 'INSERT INTO student (email, password, first_name, last_name, university, academic_year, major, username) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
  values = [
    req.body.email,
    req.body.password,
    req.body.first_name,
    req.body.last_name,
    req.body.university,
    req.body.academic_year,
    req.body.major,
    req.body.username
  ]

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
    } else {
      if (res_from_db.rows.length == 1) {
        res.json({ success: true, result: res_from_db.rows[0] })
      } else { res.json({ success: false }) }
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
      res.json({ success: false })
    } else {
      if (res_from_db.rows.length == 1) {
        req.session.username = req.body.email;
        res.json({ success: true, result: res_from_db.rows[0] })
      } else { res.json({success: false }) }
    }
  }) 
});

app.post('/login',(req,res) => {
  // check if user with this email and password exists
  text = 'SELECT username FROM student WHERE (email = $1 AND password = $2) OR (username = $1 AND password = $2)'
  values = [req.body.email, req.body.password]

  console.log(req.session)
  console.log(req.session.username)

  pgClient.query(text, values, (err, student) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
    } else {
      if (student.rows.length == 1) {
        req.session.username = student.rows[0].username;
        res.json({ success: true, result: student.rows[0] })
      } else { res.json({ success: false }) }
    }
  }) 
});

app.get('/',(req,res) => {
  let sess = req.session
  if(sess.username) res.json({ success: true })
  else res.json({ success: false })
});

app.post('/session', (req, res) => {
  console.log(req.session)
  console.log(req.session.username)
  if (req.session.username) res.json({ success: true })
  else res.json({ success: false })
})

app.post('/profile', (req, res) => {
   text = 'SELECT * FROM student WHERE username = $1'
   values = [req.body.username]
 
   pgClient.query(text, values, (err, student) => {
      if (err) { console.log(err.stack) }
      if (err || student.rows.length != 1) {
        res.json({ success: false })
        return
      }

      editable = false;
      if (req.session.username == student.rows[0].username) { editable = true; }

      text = 'SELECT * FROM friends WHERE friend1 = $1 OR friend2 = $1'
      values = [student.rows[0].id]

      // find that student's friends
      pgClient.query(text, values, (err, friend_list) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return
        }

        text = 'SELECT first_name, last_name, username FROM student WHERE'
        values = []

        // get each friend's first, last name, and email
        for (var i = 0; i < friend_list.rows.length; i++) {
          friend_id = friend_list.rows[i].friend1
          if (friend_id == student.rows[0].id) { friend_id = friend_list.rows[i].friend2 }

          text += ' id = $' + (i + 1).toString()
          if (i != friend_list.rows.length - 1) text += ' OR'
          values[i] = friend_id
        }

        if (values.length != 0) {
          pgClient.query(text, values, (err, friends) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return
            }
            // get that student's sections
            text = 'SELECT section_id FROM section_student WHERE student_id = $1'
            values = [student.rows[0].id]

            pgClient.query(text, values, (err, section_list) => {
              if (err) {
                console.log(err.stack)
                res.json({ success: false })
                return
              }
              text = 'SELECT * FROM sections WHERE'
              values = []

              // get each friend's first, last name, and email
              for (var i = 0; i < section_list.rows.length; i++) {
                text += ' id = $' + (i + 1).toString()
                if (i != section_list.rows.length - 1) text += ' OR'
                values[i] = section_list.rows[i].section_id
              }

              if (values.length != 0) {
                pgClient.query(text, values, (err, sections) => {
                  if (err) {
                    console.log(err.stack)
                    res.json({ success: false })
                    return
                  }
                  res.json({
                    success: true,
                    result: student.rows[0],
                    friends: friends.rows,
                    sections: sections.rows,
                    editable: editable
                  })
                })
              } else {
                res.json({
                  success: true,
                  result: student.rows[0],
                  friends: friends.rows,
                  sections: [],
                  editable: editable
                })
              }
            })
          })
        } else {
          // get that student's sections
          text = 'SELECT section_id FROM section_student WHERE student_id = $1'
          values = [student.rows[0].id]

          pgClient.query(text, values, (err, section_list) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return
            }
            text = 'SELECT * FROM sections WHERE'
            values = []

            for (var i = 0; i < section_list.rows.length; i++) {
              text += ' id = $' + (i + 1).toString()
              if (i != section_list.rows.length - 1) text += ' OR'
              values[i] = section_list.rows[i].section_id
            }

            if (values.length != 0) {
              pgClient.query(text, values, (err, sections) => {
                if (err) {
                  console.log(err.stack)
                  res.json({ success: false })
                  return
                }
                res.json({
                  success: true,
                  result: student.rows[0],
                  friends: [],
                  sections: sections.rows,
                  editable: editable
                })
              })
            } else {
              res.json({
                success: true,
                result: student.rows[0],
                friends: [],
                sections: [],
                editable: editable
              })
            }
          })
        }
      })
   }) 
})

app.post('/editProfile', (req, res) => {
  // get which profile we are modifying the data for and new data
  // push data to database, return data to client
  text = 'UPDATE student SET first_name = $1, last_name = $2, preferred_name = $3, pronouns = $4, university = $5, academic_year = $6, major = $7, email = $8 WHERE username = $9 RETURNING *'
  values = [
    req.body.first_name,
    req.body.last_name,
    req.body.preferred_name,
    req.body.pronouns,
    req.body.university,
    req.body.academic_year,
    req.body.major,
    req.body.email,
    req.body.username
  ]

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }
    if (res_from_db.rows.length == 1) {
      res.json({ success: true, result: res_from_db.rows[0] })
    } else { res.json({ success: false }) }
  }) 
})

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) res.json({success: false})
      else res.json({success: true})
  });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
      if(err) res.json({success: false})
      else res.json({success: true})
  });
});

app.post('/addSection', (req, res) => {
  text = 'INSERT INTO sections (section_name, professor, section_time, semester, cohort, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
  values = [
    req.body.section_name,
    req.body.section_prof,
    req.body.section_time,
    req.body.section_semester,
    req.body.section_cohort,
    req.body.section_code
  ]

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }
    if (res_from_db.rows.length == 1) {
      res.json({ success: true, result: res_from_db.rows[0] })
    } else { res.json({ success: false }) }
  }) 
});

app.post('/addStudentToSection', (req, res) => {
  text = 'SELECT id FROM student WHERE email = $1 OR username = $1'
  values = [req.body.student_email]

  pgClient.query(text, values, (err, student) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }
    if (student.rows.length == 1) {
      text = 'SELECT id FROM sections WHERE code = $1'
      values = [req.body.section_code]

      pgClient.query(text, values, (err, section) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return
        }
        if (section.rows.length == 1) {
          text = 'INSERT INTO section_student (section_id, student_id) VALUES ($1, $2) RETURNING *'
          values = [section.rows[0].id, student.rows[0].id]
          console.log('here3')

          pgClient.query(text, values, (err, section_student) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return
            }
            if (section_student.rows.length == 1) {
              res.json({ success: true, result: section_student.rows[0] })
            } else { res.json({ success: false }) }
          })
        } else { res.json({ success: false }) }
      })
    } else { res.json({ success: false }) }
  }) 
});

app.listen(port)
