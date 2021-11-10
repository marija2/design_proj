import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"
import { generatePath } from "react-router";

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
          var path = generatePath("/profile/:username", { username: data.result.username })
          // will be changed to home page, just need to create profile page first
          this.setState({ redirect: path });
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
      return (<form onSubmit={this.handleSubmit}>
        <a href={`/admin/login`}>Admin login</a>
        <Container>
          <Row className="p-3">
            <InputGroup>
              <FormControl
                placeholder="Email or Username"
                name="email">
                </FormControl>
            </InputGroup>
          </Row>
          <Row className="p-3">
            <InputGroup>
              <FormControl
                placeholder="Password"
                name="password"
                type="password">
              </FormControl>
            </InputGroup>
          </Row>
        </Container>
        <Button type="submit" > Sign in</Button>
      </form>
      )
    }
  }

  export default Login;