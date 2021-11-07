function getSection (req, res) {
    console.log("I WAS HERE")
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
            section: section })
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
          text = 'SELECT first_name, last_name, username FROM student WHERE'
          values = []
  
          for (var i = 0; i < student_ids.rows.length; i++) {
            text += ' id = $' + (i + 1).toString()
            if (i != student_ids.rows.length - 1) text += ' OR'
            values[i] = student_ids.rows[i].student_id
          }
  
          if (values == []) {
            //has no students, so has no posts and comments
            res.json({
              success: true,
              section: section,
              posts: [],
              comments: [] })
            return
          }
          pgClient.query(text, values, (err, student_info) => {
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
                text += ' id = $' + (i + 1).toString()
                if (i != posts.rows.length - 1) text += ' OR'
                values[i] = posts.rows[i].id
              }
  
              if (values == []) {
                res.json({
                  success: true,
                  section: section,
                  posts: posts,
                  comments: [] })
                return
              }
  
              pgClient.query(text, values, (err, comments) => {
                if (err) {
                  console.log(err.stack)
                  res.json({ success: false })
                  return }
                res.json({
                  success: true,
                  section: section,
                  posts: posts,
                  comments: comments })
              })
            })
          })
        })
      })
    })
  }

  module.exports = { getSection }