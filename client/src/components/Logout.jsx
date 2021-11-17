import React from "react";
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

import "./Profile.css"

class Logout extends React.Component{

  constructor(props) {
    super(props)
    this.state = { redirect: false }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHome = this.handleHome.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    postRequest('/logout', {
      username: "someval",
      password: "someval" }
    ).then(data => {
      if (data.success === true) {
        this.setState({ redirect: "/login" })
      }
    })
  }

  handleHome(e) {
    e.preventDefault();
    this.setState({ redirect: "/" })
  }

  render() {
    if (this.state.redirect) { return <Redirect to={this.state.redirect} /> }
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
              <div className="mt-150 text-secondary">
                <h3>Want to log out?</h3>
              </div>
              <div className="m-3">
                <form onSubmit={this.handleSubmit}>
                  <Button type="submit" variant="dark"> Log out </Button>
                </form>
              </div>
              <div>
                <form onSubmit={this.handleHome}>
                  <Button type="submit" variant="outline-dark"> Home page </Button>
                </form>
              </div>
            </div>
          </div>
    )
  }
}

export default Logout;