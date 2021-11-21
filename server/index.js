var pg = require('pg')
var path = require('path')
var connectionString = "postgres://newuser:password@127.0.0.1:5432/postgres";
// var connectionString = process.env.DATABASE_URL
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

app.use(express.static(path.resolve(__dirname, '../client')));

app.use(session({
  secret: 'ssshhhhh',
  store: new redisStore({ host: '127.0.0.1', port: 3001, client: client,ttl : 260}),
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function executeQuery(text, values, res) {
  pgClient.query(text, values, (err, res_from_db) => {
    if (err) console.log(err.stack)

    if (err || res_from_db.rows.length != 1) {
      res.json({ success: false })
      return
    }

    res.json({ success: true, result: res_from_db.rows[0] })
  }) 
}

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

  executeQuery(text, values, res);
});

app.post('/addClass', (req, res) => {
  text = 'INSERT INTO classes (class_name, code) VALUES ($1, $2) RETURNING *'
  values = [ req.body.class_name, req.body.code ]

  executeQuery(text, values, res);
});

app.post('/admin/login',(req,res) => {
  // check if user with this email and password exists
  text = 'SELECT * FROM admin WHERE email = $1 AND password = $2'
  values = [req.body.email, req.body.password]

  console.log(req.session)
  console.log(req.session.username)

  pgClient.query(text, values, (err, res_from_db) => {
    if (err) console.log(err.stack)

    if (err || res_from_db.rows.length != 1) {
      res.json({ success: false })
      return
    }

    req.session.username = req.body.email;
    res.json({ success: true, result: res_from_db.rows[0] })
  }) 
});

app.post('/login',(req,res) => {
  // check if user with this email and password exists
  text = 'SELECT id, username FROM student WHERE (email = $1 AND password = $2) OR (username = $1 AND password = $2)'
  values = [req.body.email, req.body.password]

  console.log(req.session.username)

  pgClient.query(text, values, (err, student) => {
    if (err) console.log(err.stack)

    if (err || student.rows.length != 1) {
      res.json({ success: false })
      return
    }

    req.session.username = student.rows[0].username
    req.session.my_id = student.rows[0].id
    res.json({ success: true, result: student.rows[0] })
  }) 
});

app.get('/',(req,res) => {
  if(req.session.username) res.json({ success: true })
  else res.json({ success: false })
});

app.post('/home', (req, res) => {
  if (!req.session.username) {
    res.json({ success: true, session: false })
    return
  }
  
  // get all posts from all sections this student is taking

  text = 'SELECT * FROM section_student WHERE student_id = $1'
  values = [req.session.my_id]

  pgClient.query(text, values, (err, section_ids) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }

    if (section_ids.rows.length == 0) {
      res.json({
        success: true,
        session: true,
        sections: [],
        my_username: req.session.username
      })
    }

    text = 'SELECT * FROM sections WHERE'
    values = []

    for (var i = 0; i < section_ids.rows.length; i++) {
      text += ' id = $' + (i + 1).toString()
      if (i != section_ids.rows.length - 1) text += ' OR'
      values[i] = section_ids.rows[i].section_id
    }

    pgClient.query(text, values, (err, sections) => {
      if (err) {
        console.log(err.stack)
        res.json({ success: false })
        return
      }

      text = 'SELECT * FROM posts WHERE'
      values = []

      for (var i = 0; i < section_ids.rows.length; i++) {
        text += ' section_id = $' + (i + 1).toString()
        if (i != section_ids.rows.length - 1) text += ' OR'
        values[i] = section_ids.rows[i].section_id
      }

      pgClient.query(text, values, (err, posts) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return
        }

        if (posts.rows.length == 0) {
          res.json({
            success: true,
            session: true,
            sections: sections.rows,
            posts: [],
            my_username: req.session.username
          })
          return
        }

        // get info on students who have posted

        text = 'SELECT id, first_name, last_name, username FROM student WHERE'
        values = []

        for (var i = 0; i < posts.rows.length; i++) {
          text += ' id = $' + (i + 1).toString()
          if (i != posts.rows.length - 1) text += ' OR'
          values[i] = posts.rows[i].student_id
        }

        pgClient.query(text, values, (err, posters) => {
          if (err) {
            console.log(err.stack)
            res.json({ success: false })
            return
          }

          text = 'SELECT * FROM post_comments WHERE'
          values = []
  
          for (var i = 0; i < posts.rows.length; i++) {
            text += ' post_id = $' + (i + 1).toString()
            if (i != posts.rows.length - 1) text += ' OR'
            values[i] = posts.rows[i].id
          }

          pgClient.query(text, values, (err, comments) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return
            }

            if (comments.rows.length == 0) {
              res.json({
                success: true,
                session: true,
                sections: sections.rows,
                posts: posts.rows,
                posters: posters.rows,
                comments: [],
                my_username: req.session.username
              })
              return
            }

            text = 'SELECT id, first_name, last_name, username FROM student WHERE'
            values = []

            for (var i = 0; i < comments.rows.length; i++) {
              text += ' id = $' + (i + 1).toString()
              if (i != comments.rows.length - 1) text += ' OR'
              values[i] = comments.rows[i].student_id
            }

            pgClient.query(text, values, (err, commenters) => {
              if (err) {
                console.log(err.stack)
                res.json({ success: false })
                return
              }

              res.json({
                success: true,
                session: true,
                sections: sections.rows,
                posts: posts.rows,
                posters: posters.rows,
                comments: comments.rows,
                commenters: commenters.rows,
                my_username: req.session.username
              })
            })
          })
        })
      })
    })
  })
})

app.post('/session', (req, res) => {
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
        return }

      editable = false
      my_id = req.session.my_id

      if (my_id == student.rows[0].id) { editable = true }

      text = 'SELECT * FROM friends WHERE friend1 = $1 OR friend2 = $1'
      values = [student.rows[0].id]

      // find that student's friends
      pgClient.query(text, values, (err, friend_list) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return }

        text = 'SELECT id, first_name, last_name, username FROM student WHERE'
        values = []

        friend = false;

        // get each friend's first, last name, and email
        for (var i = 0; i < friend_list.rows.length; i++) {
          friend_id = friend_list.rows[i].friend1

          if (friend_id == student.rows[0].id) {
            friend_id = friend_list.rows[i].friend2
          }

          if (friend_id == my_id) friend = true

          text += ' id = $' + (i + 1).toString()
          if (i != friend_list.rows.length - 1) text += ' OR'
          values[i] = friend_id
        }

        if (values.length != 0) {
          pgClient.query(text, values, (err, friends) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return }
            
            // get that student's sections
            text = 'SELECT section_id FROM section_student WHERE student_id = $1'
            values = [student.rows[0].id]

            pgClient.query(text, values, (err, section_list) => {
              if (err) {
                console.log(err.stack)
                res.json({ success: false })
                return }
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
                    editable: editable,
                    friend: friend,
                    my_id: my_id,
                    my_username: req.session.username })
                })
              } else {
                res.json({
                  success: true,
                  result: student.rows[0],
                  friends: friends.rows,
                  sections: [],
                  editable: editable,
                  friend: friend,
                  my_id: my_id,
                  my_username: req.session.username })
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
              return }
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
                  return }
                res.json({
                  success: true,
                  result: student.rows[0],
                  friends: [],
                  sections: sections.rows,
                  editable: editable,
                  friend: friend,
                  my_id: my_id,
                  my_username: req.session.username })
              })
            } else {
              res.json({
                success: true,
                result: student.rows[0],
                friends: [],
                sections: [],
                editable: editable,
                friend: friend,
                my_id: my_id,
                my_username: req.session.username })
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

  executeQuery(text, values, res);
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

  executeQuery(text, values, res);
});

app.post('/addStudentToSection', (req, res) => {
  text = 'SELECT id FROM student WHERE email = $1 OR username = $1'
  values = [req.body.student_email]

  pgClient.query(text, values, (err, student) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return }
    if (student.rows.length == 1) {
      text = 'SELECT id FROM sections WHERE code = $1'
      values = [req.body.section_code]

      pgClient.query(text, values, (err, section) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return }
        if (section.rows.length == 1) {
          text = 'INSERT INTO section_student (section_id, student_id) VALUES ($1, $2) RETURNING *'
          values = [section.rows[0].id, student.rows[0].id]
          console.log('here3')

          pgClient.query(text, values, (err, section_student) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return }
            if (section_student.rows.length == 1) {
              res.json({ success: true, result: section_student.rows[0] })
            } else { res.json({ success: false }) }
          })
        } else { res.json({ success: false }) }
      })
    } else { res.json({ success: false }) }
  }) 
});

app.post('/section', (req, res) => {
  text = 'SELECT * FROM sections WHERE code = $1'
  values = [req.body.code]
 
  pgClient.query(text, values, (err, section) => {
    if (err) {
      console.log(err.stack)
      res.json({ success: false })
      return }
    // check if this student is enrolled in this section
    text = 'SELECT * FROM section_student WHERE section_id = $1 AND student_id = ' + 
          '(SELECT id FROM student WHERE username = $2)'
    values = [section.rows[0].id, req.session.username]

    pgClient.query(text, values, (err, enrolled) => {
      if (err) {
        console.log(err.stack)
        res.json({ success: false })
        return }
      // if student isn't enrolled in section only return info about section
      if (enrolled.rows.length == 0) {
        res.json({
          success: true,
          enrolled: false,
          section: section.rows[0],
          students: [],
          posts: [],
          comments: [],
          my_username: req.session.username
         })
        return
      }
      //if student is enrolled in section, get posts, comments, and other students in the section
      text = 'SELECT student_id from section_student WHERE section_id = $1'
      values = [section.rows[0].id]

      pgClient.query(text, values, (err, student_ids) => {
        if (err) {
          console.log(err.stack)
          res.json({ success: false })
          return }
        text = 'SELECT id, first_name, last_name, username FROM student WHERE'
        values = []

        for (var i = 0; i < student_ids.rows.length; i++) {
          text += ' id = $' + (i + 1).toString()
          if (i != student_ids.rows.length - 1) text += ' OR'
          values[i] = student_ids.rows[i].student_id
        }

        //section has at least 1 student because current student is enrolled
        pgClient.query(text, values, (err, students) => {
          if (err) {
            console.log(err.stack)
            res.json({ success: false })
            return }
          // need to get posts and comments
          text = 'SELECT * FROM posts WHERE section_id = $1'
          values = [section.rows[0].id]
          pgClient.query(text, values, (err, posts) => {
            if (err) {
              console.log(err.stack)
              res.json({ success: false })
              return }
            text = 'SELECT * FROM post_comments WHERE'
            values = []

            for (var i = 0; i < posts.rows.length; i++) {
              text += ' post_id = $' + (i + 1).toString()
              if (i != posts.rows.length - 1) text += ' OR'
              values[i] = posts.rows[i].id
            }

            if (values.length == 0) {
              res.json({
                success: true,
                enrolled: true,
                section: section.rows[0],
                students: students.rows,
                posts: posts.rows,
                comments: [],
                my_username: req.session.username })
              return
            }

            pgClient.query(text, values, (err, comments) => {
              if (err) {
                console.log(err.stack)
                res.json({ success: false })
                return }
              res.json({
                success: true,
                enrolled: true,
                section: section.rows[0],
                students: students.rows,
                posts: posts.rows,
                comments: comments.rows,
                my_username: req.session.username })
            })
          })
        })
      })
    })
  })
});

app.post('/comment', (req, res) => {
  console.log("adding comment")
  text = 'INSERT INTO post_comments (comment_content, comment_time, post_id, student_id) VALUES ($1, current_timestamp, $2, $3) RETURNING *'
  values = [
    req.body.comment_content,
    req.body.post_id,
    req.body.student_id
  ]

  executeQuery(text, values, res);
})

app.post('/like', (req, res) => {
  text = 'UPDATE posts SET likes = $1 WHERE id = $2 RETURNING *'
  values = [ req.body.likes, req.body.post_id ]

  executeQuery(text, values, res);
})

app.post('/drop', (req, res) => {
  text = 'DELETE FROM section_student WHERE student_id = $1 AND section_id = $2'
  values = [ req.body.student_id, req.body.section_id ]

  pgClient.query(text, values, (err, deleted) => {
    if (err) console.log(err.stack)

    if ( err || deleted == 0 ) {
      res.json({ success: false })
      return
    }

    res.json({ success: true })
  })
})

app.post('/unfriend', (req, res) => {
  text = 'DELETE FROM friends WHERE (friend1 = $1 AND friend2 = $2) OR (friend1 = $2 AND friend2 = $1)'
  values = [ req.body.my_id, req.body.friends_id ]

  pgClient.query(text, values, (err, unfriended) => {
    if (err) console.log(err.stack)

    if ( err || unfriended == 0 ) {
      res.json({ success: false })
      return
    }

    res.json({ success: true })
  })
})

app.post('/friend', (req, res) => {
  text = 'INSERT INTO friends (friend1, friend2) VALUES ($1, $2) RETURNING *'
  values = [ req.body.my_id, req.body.friends_id ]

  pgClient.query(text, values, (err, friended) => {
    if (err) console.log(err.stack)

    if ( err || friended.rows.length != 1 ) {
      res.json({ success: false })
      return
    }

    text = 'SELECT id, first_name, last_name, username FROM student WHERE id = $1'
    values = [my_id]

    executeQuery(text, values, res);
  })
})

app.post('/post', (req, res) => {
  text = 'SELECT id, first_name, last_name, username FROM student WHERE username = $1'
  values = [req.body.my_username]

  pgClient.query(text, values, (err, student) => {
    if (err) console.log(err.stack)

    if ( err || student.rows.length != 1 ) {
      res.json({ success: false })
      return
    }

    text = 'INSERT INTO posts (post_content, likes, section_id, student_id, post_time) VALUES ($1, $2, $3, $4, current_timestamp) RETURNING *'
    values = [
      req.body.post_content,
      0,
      req.body.section_id,
      student.rows[0].id
    ]

    pgClient.query(text, values, (err, post) => {
      if (err) console.log(err.stack)
  
      if ( err || post.rows.length != 1 ) {
        res.json({ success: false })
        return
      }

      res.json({
        success: true,
        post: post.rows[0],
        student: student.rows[0]
      })

    })
  })
})

app.post('/search', (req, res) => {
  text = 'SELECT username, first_name, last_name FROM student WHERE first_name LIKE $1 OR last_name LIKE $1 OR username LIKE $1'
  values = ['%' + req.body.search + '%']

  pgClient.query(text, values, (err, students) => {
    if ( err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }

    text = 'SELECT code, section_name FROM sections WHERE section_name LIKE $1 OR code LIKE $1'

    pgClient.query(text, values, (err, sections) => {
      if ( err) {
        console.log(err.stack)
        res.json({ success: false })
        return
      }

      res.json({
        success: true,
        students: students.rows,
        sections: sections.rows
      })
    })
  })
})

app.post('/messages', (req, res) => {
  text = 'SELECT * FROM msgs WHERE sender = $1 OR receiver = $1'
  values = [req.session.my_id]

  pgClient.query(text, values, (err, msgs) => {
    if ( err) {
      console.log(err.stack)
      res.json({ success: false })
      return
    }

    res.json({ success: true, result: msgs.rows })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

app.listen(port)
