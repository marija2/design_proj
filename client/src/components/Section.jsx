import React from "react";
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

class Post {
    constructor(post) {
        this.post = post
        this.comments = []
        this.student_first_name = ""
        this.student_last_name = ""
        this.student_username = ""
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
    }
}

class Comment {
    constructor(comment) {
        this.comment = comment
        this.student_first_name = ""
        this.student_last_name = ""
        this.student_username = ""
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
    }
}

class Section extends React.Component{
    constructor(props) {
      super(props)

      this.state = {
        redirect: false,
        code: props.data.code
      }

    //   this.handleSubmit = this.handleSubmit.bind(this);

      // need to get info from db
      postRequest('/section', {
        code: props.data.code
      }).then(data => {
        console.log(data)

        if (data.success === true) {
            var posts_with_comments = [];
            for(var i = 0; i < data.posts.length; i++) {
                posts_with_comments[i] = new Post(data.posts[i])

                console.log(data.students.length)
                // find student that posted that
                for(var j = 0; j < data.students.length; j++) {
                    if (data.students[j].id === data.posts[i].student_id) {
                        posts_with_comments[i].setStudent(data.students[j])
                        break
                    }
                }

                for(j = 0; j < data.comments.length; j++) {
                    if (data.comments[j].post_id === data.posts[i].id) {
                        var comment = new Comment(data.comments[j])

                        // find student that wrote that comment
                        for(var k = 0; k < data.students.length; k++) {
                            if (data.students[k].id === data.comments[j].student_id) {
                                comment.setStudent(data.students[k])
                                break
                            }
                        }

                        posts_with_comments[i].comments.push(comment)
                    }
                }
            } 
            console.log(posts_with_comments)
            this.setState({
                name: data.section.section_name,
                professor: data.section.professor,
                time: data.section.section_time,
                semester: data.section.semester,
                cohort: data.section.cohort,
                students: data.students,
                posts: posts_with_comments,
                enrolled: data.enrolled
            });
        }
      })
    }

    getStudent(student) {
        return (<h6>{student.first_name} {student.last_name} {student.username}</h6>)
    }

    getStudents() {
        if (!this.state.students) return
        if (this.state.enrolled === false) return

        var students = [<h3>Students</h3>]
        for (var i = 0; i < this.state.students.length; i++) {
            students[i + 1] = this.getStudent(this.state.students[i])
        }
        return students
    }

    getPost(post) {
        return(<h6>{post.post.post_content} {post.post.post_time} {post.post.likes} </h6>)
    }

    getPosts() {
        if (!this.state.posts) return
        if (this.state.enrolled === false) return

        var posts = [<h3>Posts</h3>]
        for (var i = 0; i < this.state.posts.length; i++) {
            posts[i + 1] = this.getPost(this.state.posts[i])
        }
        return posts
    }

    render(){
        return (
            <div>
                <h5>{this.state.name}</h5>
                <h5>{this.state.professor}</h5>
                <h5>{this.state.time}</h5>
                <h5>{this.state.code}</h5>
                <h5>{this.state.semester}</h5>
                <h5>{this.state.cohort}</h5>

                {this.getStudents()}
                {this.getPosts()}
            </div>
        )
    }
}

export default Section;