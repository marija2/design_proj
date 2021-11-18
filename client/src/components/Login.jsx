import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"
import { generatePath } from "react-router";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import "./Profile.css"

class Login extends React.Component{
    constructor(props) {
      super(props)

      this.state = { redirect: false }
      this.handleSubmit = this.handleSubmit.bind(this);

      // if user is logged in and trying to log in, redirect to home page
      postRequest('/session', {}
        ).then(data => {
            if (data.success === true) {
              this.state = { redirect: "/" }
            }
        })
    }
  
    handleSubmit(e) {
      e.preventDefault();
  
      postRequest('/login', {
        email: e.target.email.value,
        password: e.target.password.value }
      ).then(data => {
        console.log(data)
        if (data.success === true) {
          // var path = generatePath("/profile/:username", { username: data.result.username })

          // will be changed to home page, just need to create profile page first
          this.setState({ redirect: "/" });
        } else {
          e.target.email.value = ""
          e.target.password.value = ""
          // add what happens if incorrect email/password
        }
      })
    }
  
    render (){
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect}/>
      }
      return (
        <div className="w-100 h-100 bg-light text-dark fs-5">
          <Navbar bg="light" expand="lg" fixed="top">
              <Container>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                  </Nav>
                  <Nav>
                  <Nav.Link href="/admin/login">Admin</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
              </Container>
          </Navbar>
          <div className="w-100 mt-50 p-5 h-100 fixed-top bg-light text-dark">
            <div className="w-100 mt-150 text-secondary">
              <h1>Welcome</h1>
            </div>
            <form onSubmit={this.handleSubmit}>
              <Container>
                <Row className="mt-4 mb-3 mlr-300">
                  <InputGroup>
                    <FormControl
                      placeholder="Email or Username"
                      name="email">
                      </FormControl>
                  </InputGroup>
                </Row>
                <Row className="mb-3 mlr-300">
                  <InputGroup>
                    <FormControl
                      placeholder="Password"
                      name="password"
                      type="password">
                    </FormControl>
                  </InputGroup>
                </Row>
                <Button type="submit" variant="dark"> Sign in</Button>
              </Container>
            </form>
          </div>
        </div>
      )
    }
  }

  export default Login;