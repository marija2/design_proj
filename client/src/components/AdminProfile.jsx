import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

class AdminProfile extends React.Component{
    constructor(props) {
      super(props)
      this.state = {
        redirect: false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      this.state = {
        email: props.data.email
      }
    }
  
    // should call this methos when a form with new info is submitted
    handleSubmit(e) {
      e.preventDefault();
  
      postRequest('/addStudent', {
        email: e.target.student_email.value,
        password: e.target.student_password.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        university: e.target.university.value,
        academic_year: e.target.academic_year.value,
        major: e.target.major.value
      }).then(data => {
        console.log(data)
        if (data.success === true) {
          this.setState({
            rerender: true
          });
        }
      })
    }

    render (){
      return (
        <form onSubmit={this.handleSubmit}>
            Add a student to the database:
            <Container>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="Student Email"
                    name="student_email">
                    </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="Student Password"
                    name="student_password">
                </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="First Name"
                    name="first_name">
                </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="Last Name"
                    name="last_name">
                </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="University"
                    name="university">
                </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="Academic year"
                    name="academic_year">
                </FormControl>
                </InputGroup>
            </Row>
            <Row class="p-3">
                <InputGroup>
                <FormControl
                    placeholder="Major"
                    name="major">
                </FormControl>
                </InputGroup>
            </Row>
            </Container>
            <Button type="submit" > Add student </Button>
        </form>
      )
    }
  }

  export default AdminProfile;