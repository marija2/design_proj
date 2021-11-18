import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav'
import postRequest from "./PostRequest"
import Navbar from 'react-bootstrap/Navbar'
import PostRender from "./PostRender";
import Post from "./Post";
import Comment from "./Comment";

import "./Profile.css";

class Section extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        redirect: false,
        code: props.data.code
      }

      this.handlePost = this.handlePost.bind(this);

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
            id: data.section.id,
            students: data.students,
            posts: posts_with_comments,
            enrolled: data.enrolled,
            my_username: data.my_username
        });
      })
    }

    getStudent(student) {
        return(
            <Card className="text-dark m-1">
                <Card.Body className="h6 m-0 p-2">
                      < a href={`/profile/${student.username}`} class="text-dark text-decoration-none">
                        {student.first_name} {student.last_name}
                      </a>
                </Card.Body>
            </Card>
          )
    }

    getStudents() {
        if (!this.state.students) return
        if (this.state.enrolled === false) return

        var students = []
        for (var i = 0; i < this.state.students.length; i++) {
            students[i] = this.getStudent(this.state.students[i])
        }
        return students
    }

    getPost(post, i) {
        return(<PostRender
                post={post.post}
                comments={post.comments}
                student_first_name={post.student_first_name}
                student_last_name={post.student_last_name}
                student_username={post.student_username}
                student_id={post.student_id}
                section_name={post.section_name}
                section_code={post.section_code}
                key={i}
            />)
    }

    getPosts() {
        if (!this.state.posts) return
        if (this.state.enrolled === false) return

        var posts = []
        var c = 0;
        for (var i = this.state.posts.length - 1; i >= 0; i--) {
            posts[c] = this.getPost(this.state.posts[i], i)
            c++
        }
        return posts
    }

    handlePost(e) {
        e.preventDefault()

        if (e.target.post_content.value == "") return

        postRequest('/post', {
            post_content: e.target.post_content.value,
            section_id: this.state.id,
            my_username: this.state.my_username
        }).then(data => {
            if (data.success === false) return

            console.log(this.state.posts)
            console.log(this.state.posts.length)

            var new_posts = this.state.posts
            new_posts[this.state.posts.length] = new Post(
                data.post,
                data.student.first_name,
                data.student.last_name,
                data.student.username)

            console.log(new_posts)
            console.log(new_posts.length)

            e.target.post_content.value = ""

            this.setState({ posts: new_posts })
        })
    }

    getNotEnrolled() {
        if (this.state.enrolled === true) return

        return(
            <div class="row h-100 justify-content-md-center">
                <div class="col-4">
                    <Card>
                        <Card.Body>
                            <h5>{this.state.name}</h5>
                            <h6><any class="text-secondary">Professor:</any> {this.state.professor}</h6>
                            <h6><any class="text-secondary">Time:</any> {this.state.time}</h6>
                            <h6><any class="text-secondary">Code:</any>{this.state.code}</h6>
                            <h6><any class="text-secondary">Semester:</any> {this.state.semester}</h6>
                            <h6> <any class="text-secondary">Cohort:</any> {this.state.cohort}</h6>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        )
    }

    getEnrolled() {
        if (this.state.enrolled === false) return
        return (
            <div class="row h-100">
                <div class="col-3 h-100 overflow-auto">
                    <div class="row h-30 overflow-auto">
                        <div class="col">
                            <Card>
                                <Card.Body>
                                    <h5>{this.state.name}</h5>
                                    <h6><any class="text-secondary">Professor:</any> {this.state.professor}</h6>
                                    <h6><any class="text-secondary">Time:</any> {this.state.time}</h6>
                                    <h6><any class="text-secondary">Code:</any>{this.state.code}</h6>
                                    <h6><any class="text-secondary">Semester:</any> {this.state.semester}</h6>
                                    <h6> <any class="text-secondary">Cohort:</any> {this.state.cohort}</h6>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <h5>Students</h5>
                    <div class="row h-60 overflow-auto">
                        <div class="col">
                            {this.getStudents()}
                        </div>
                    </div>
                </div>
                <div class="col h-100 overflow-auto">
                    <div class="row h-10 overflow-auto">
                        <div class="col">
                            <form onSubmit={this.handlePost}>
                            <InputGroup>
                                <FormControl type="text"
                                            placeholder="Add a post"
                                            name="post_content"
                                            size="lg">
                                </FormControl>
                                <Button variant="dark" type="submit">
                                    +
                                </Button>
                            </InputGroup>
                            </form>
                        </div>
                    </div>
                    <div class="row h-80 overflow-auto">
                        <div class="col mt-4">
                            {this.getPosts()}
                        </div>
                    </div>
                </div>
            </div>
        )
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
            {this.getNotEnrolled()}
            {this.getEnrolled()}
          </div>
        </div>
        )
    }
}

export default Section;