import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import postRequest from "./PostRequest"

import "./Profile.css"

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = { redirect: false }

        postRequest('/session', {}
        ).then(data => {
            if (data.success === false) {
                this.state = { redirect: "/login" }
            }
        })
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
                    <Nav.Link href="/">Profile</Nav.Link>
                    <Nav.Link href="/">Messages</Nav.Link>
                    </Nav>
                    <Nav>
                    <Nav.Link href="/logout">Log out</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="w-100 mt-50 p-5 h-100 fixed-top bg-light text-dark">
            Welcome to the home page
            </div>
          </div>
        )
    }
}

export default Home;
