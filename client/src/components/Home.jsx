import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import postRequest from "./PostRequest"
import Card from 'react-bootstrap/Card'
import PostRender from "./PostRender";
import Post from "./Post";
import Comment from "./Comment";

import "./Profile.css"

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = { redirect: false }

        postRequest('/home', {}
        ).then(data => {
            if (data.success === false) return

            if (data.session === false ){
                this.state = { redirect: "/login" }
                return
            }

            var new_posts = []

            // get posts with their posters and their section
            for (var i = 0; i < data.posts.length; i++) {
                new_posts[i] = new Post(data.posts[i])

                for(var j = 0; j < data.posters.length; j++) {
                    if (data.posters[j].id == data.posts[i].student_id) {
                        new_posts[i].setStudent(data.posters[j])
                        break
                    }
                }

                for(var j = 0; j < data.sections.length; j++) {
                    if(data.sections[j].id == data.posts[i].section_id) {
                        new_posts[i].setSection(data.sections[j])
                        break
                    }
                }

                for(var j = 0; j < data.comments.length; j++) {
                    if (data.comments[j].post_id == data.posts[i].id) {
                        var comment = new Comment(data.comments[j])
    
                        // find student that wrote that comment
                        for(var k = 0; k < data.commenters.length; k++) {
                            if (data.commenters[k].id == data.comments[j].student_id) {
                                comment.setStudent(data.commenters[k])
                                break
                            }
                        }
    
                        new_posts[i].comments.push(comment)
                    }
                }
            }

            this.setState({
                sections: data.sections,
                posts: new_posts,
                my_username: data.my_username
            })
        })
    }

    getSection(section) {
        return(
            <Card className="text-dark m-1">
                <Card.Body className="h6 m-0 p-2">
                      < a href={`/section/${section.code}`} class="text-dark text-decoration-none">
                        {section.section_name}
                      </a>
                </Card.Body>
            </Card>
          )
    }

    getSections() {
        if (!this.state.sections) return
        if (this.state.sections.length == 0) {
            return(
                <h6>You are not enrolled in any sections.</h6>
            )
        }

        var sections = []
        for (var i = 0; i < this.state.sections.length; i++) {
            sections[i] = this.getSection(this.state.sections[i])
        }
        return sections
    }

    renderSections() {
        return(
            <div class="col-3 h-100 overflow-auto">
                <h5>Sections</h5>
                <div class="row h-75 overflow-auto">
                    <div class="col">
                        {this.getSections()}
                    </div>
                </div>
            </div>
        )
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
        if (this.state.posts.length == 0) {
            return(
                <h6>No posts to display :(</h6>
            )
        }

        var new_posts = []

        for(var i = 0; i < this.state.posts.length; i++) {
            new_posts[this.state.posts.length - 1 - i] = this.getPost(this.state.posts[i], i)
        }

        return new_posts
    }

    renderPosts() {
        return(
            <div class="col h-100 overflow-auto">
                <div class="row h-90 overflow-auto">
                    <div class="col">
                        {this.getPosts()}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
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
                <div class="row h-100">
                    {this.renderSections()}
                    {this.renderPosts()}
                </div>
            </div>
          </div>
        )
    }
}

export default Home;
