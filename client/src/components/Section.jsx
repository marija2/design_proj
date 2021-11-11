import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Redirect } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import Nav from 'react-bootstrap/Nav'
import postRequest from "./PostRequest"
import Navbar from 'react-bootstrap/Navbar'

import "./Profile.css";

class PostRender extends React.Component {
    constructor(props) {
        super(props)

        this.handleLike = this.handleLike.bind(this);
        this.handleComment = this.handleComment.bind(this);

        this.state = {
            post: props.post,
            comments: props.comments,
            student_first_name: props.student_first_name,
            student_last_name: props.student_last_name,
            student_username: props.student_username,
            student_id: props.student_id
        }
    }

    getComment(comment) {
        return(
            <ListGroup.Item>
                <p className="h6">{comment.student_username}</p>
                <p className="h5">{comment.comment.comment_content}</p>
            </ListGroup.Item>
        )
    }

    getComments() {
        if (this.state.comments.length == 0) return
        var comments = []
        for (var i = 0; i < this.state.comments.length; i++) {
            comments[i] = this.getComment(this.state.comments[i])
        }
        return (
            <ListGroup className="list-group-flush">
                {comments}
            </ListGroup>
        )
    }

    handleLike() {
        postRequest('/like', {
            post_id: this.state.post.id,
            likes: this.state.post.likes + 1
        }).then(data => {
            if (data.success === false) return
            this.setState({ post: data.post })
        })

        // window.location.reload(true);
    }

    handleComment(e) {
        e.preventDefault()

        console.log("handling comment")
        console.log(this.state.student_id)

        postRequest('/comment', {
            post_id: this.state.post.id,
            comment_content: e.target.comment_content.value,
            student_id: this.state.student_id
        }).then(data => {
            if (data.success === false) return

            var comments = this.state.comments
            comments[comments.length] = new Comment(
                data.comment,
                this.state.student_first_name,
                this.state.student_last_name,
                this.state.student_username)

            e.target.comment_content.value = ""

            this.setState({ comments: comments })
        })

    }

    render() {
        return (
            <form onSubmit={this.handleComment}>
                <Card className="text-dark">
                    <Card.Header className="h5">{this.state.student_first_name} {this.state.student_last_name} </Card.Header>
                    <Card.Body className="h5">
                        {this.state.post.post_content}
                    </Card.Body>
                    {this.getComments()}
                    <FormControl type="text" placeholder="Add a comment" name="comment_content"></FormControl>
                    <Button type="submit" className="btn-light">➕</Button>
                    <Card.Footer>{this.state.post.likes}
                    <Button type="button" className="btn-light" onClick={this.handleLike}>🖤</Button>
                    </Card.Footer>
                </Card>
            </form>
        )
    }
}
 
class Post {
    constructor(post) {
        this.post = post
        this.comments = []
        this.student_first_name = ""
        this.student_last_name = ""
        this.student_username = ""
        this.student_id = 0
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
        this.student_id = student.id
    }
}

class Comment {
    // constructor(comment) {
    //     this.comment = comment
    //     this.student_first_name = ""
    //     this.student_last_name = ""
    //     this.student_username = ""
    // }

    constructor(comment, student_first_name = "", student_last_name = "", student_username = "") {
        this.comment = comment
        this.student_first_name = student_first_name
        this.student_last_name = student_last_name
        this.student_username = student_username
    }

    setStudent(student) {
        this.student_first_name = student.first_name
        this.student_last_name = student.last_name
        this.student_username = student.username
    }
}

class Section extends React.Component {
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

        if (data.success === false) return;

        var posts_with_comments = [];
        for(var i = 0; i < data.posts.length; i++) {
            posts_with_comments[i] = new Post(data.posts[i])
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
        this.setState({
            name: data.section.section_name,
            professor: data.section.professor,
            time: data.section.section_time,
            semester: data.section.semester,
            cohort: data.section.cohort,
            students: data.students,
            posts: posts_with_comments,
            enrolled: data.enrolled,
            my_username: data.my_username
        });
      })
    }

    getStudent(student) {
        return(
            <div>
                <a href={`/profile/${student.username}`} >
                    {student.first_name} {student.last_name}
                </a><br></br>
            </div>
        )
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
        return(<PostRender
            post={post.post}
            comments={post.comments}
            student_first_name={post.student_first_name}
            student_last_name={post.student_last_name}
            student_username={post.student_username}
            student_id={post.student_id}
            />)
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
        <div className="w-100 h-100 bg-light text-dark fs-5">
          <Navbar bg="light" expand="lg" fixed="top">
            <Container>
            <Navbar.Brand href="/">Home</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link href={`/profile/${this.state.my_username}`}>Profile</Nav.Link>
                <Nav.Link href="/">Messages</Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link href="/logout">Log out</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <div className="w-100 mt-50 p-5 h-100 fixed-top bg-light text-dark">
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
          </div>
        </div>
        )
    }
}

export default Section;