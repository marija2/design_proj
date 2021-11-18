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
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'

import { FaSearch } from 'react-icons/fa'

import "./Profile.css"

class Messages extends React.Component {
    constructor(props){
        super(props)

        postRequest('/messages', {}).then(data => {
            if (data.success === false) return

            console.log(data.result)
          })

        this.state = { my_username: props.data.username}
    }
    render() {
        return (
            <div className="w-100 h-100 bg-light text-dark fs-5">
                <Navbar bg="light" expand="lg" fixed="top">
                    <Container>
                        <Navbar.Brand href="/">Home</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                            <Nav.Link href={`/profile/${this.state.my_username}`}>Profile</Nav.Link>
                            <Nav.Link href={`/messages/${this.state.my_username}`}>Messages</Nav.Link>
                            </Nav>
                            <Nav>
                            <Nav.Link href="/logout">Log out</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div className="w-100 mt-60 p-5 h-100 fixed-top bg-light text-dark">
                    <div class="row h-100">
                    </div>
                </div>
            </div>
        )
    }
}

export default Messages;