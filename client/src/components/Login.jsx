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
          path = generatePath("/profile/:email/:first_name/:last_name/:preferred_name/:pronouns/:university/:academic_year/:major", {
            email: data.result.email,
            first_name: data.result.first_name,
            last_name: data.result.last_name,
            preferred_name: data.result.preferred_name,
            pronouns: data.result.pronouns,
            university: data.result.university,
            academic_year: data.result.academic_year,
            major: data.result.major
          })
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
        <Container>
          <Row class="p-3">
            <InputGroup>
              <FormControl
                placeholder="Email"
                name="email">
                </FormControl>
            </InputGroup>
          </Row>
          <Row class="p-3">
            <InputGroup>
              <FormControl
                placeholder="Password"
                name="password">
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