import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import "./Profile.css"

class AdminProfile extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            email: props.data.email,
            addStudentStatus: "",
            addSectionStatus: "",
            addStudentToSectionStatus: "",
            addClassStatus: ""
        }

        this.handleAddStudent = this.handleAddStudent.bind(this)
        this.handleAddSection = this.handleAddSection.bind(this)
        this.handleAddClass = this.handleAddClass.bind(this)
        this.handleAddStudentToSection = this.handleAddStudentToSection.bind(this)
    }
  
    // should call this methos when a form with new info is submitted
    handleAddStudent(e) {
      e.preventDefault();
  
      postRequest('/addStudent', {
        email: e.target.student_email.value,
        password: e.target.student_password.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        university: e.target.university.value,
        academic_year: e.target.academic_year.value,
        major: e.target.major.value,
        username: e.target.username.value
      }).then(data => {
        if (data.success === true) {
            e.target.student_email.value = ""
            e.target.student_password.value = ""
            e.target.first_name.value = ""
            e.target.last_name.value = ""
            e.target.university.value = ""
            e.target.academic_year.value = ""
            e.target.major.value = ""
            e.target.username.value = ""
            this.setState({ addStudentStatus: "Successfully added a student" })
        } else {
            this.setState({ addStudentStatus: "Could not successfully add a student" })
        }
      })
    }

    handleAddClass(e) {
        e.preventDefault();

        postRequest('/addClass', {
            class_name: e.target.class_name.value,
            code: e.target.code.value
          }).then(data => {
            if (data.success === true) {
                e.target.class_name.value = ""
                e.target.code.value = ""
                this.setState({ addClassStatus: "Successfully added a class"})
            } else {
                this.setState({ addClassStatus: "Couldn't successfully add a class"})
             }
          })
    }

    handleAddSection(e) {
        e.preventDefault();

        postRequest('/addSection', {
            section_name: e.target.section_name.value,
            section_prof: e.target.section_professor.value,
            section_time: e.target.section_time.value,
            section_code: e.target.section_code.value,
            section_semester: e.target.section_semester.value,
            section_cohort: e.target.section_cohort.value
          }).then(data => {
            if (data.success === true) {
                e.target.section_name.value = ""
                e.target.section_professor.value = ""
                e.target.section_time.value = ""
                e.target.section_cohort.value = ""
                e.target.section_semester.value = ""
                e.target.section_code.value = ""
                this.setState({ addSectionStatus: "Successfully added a section"})
            } else {
                this.setState({ addSectionStatus: "Couldn't successfully add a section"})
             }
          })
    }

    handleAddStudentToSection(e) {
        e.preventDefault();

        postRequest('/addStudentToSection', {
            section_code: e.target.section_code.value,
            student_email: e.target.student_email.value
          }).then(data => {
            if (data.success === true) {
                e.target.section_code.value = ""
                e.target.student_email.value = ""
                this.setState({ addStudentToSectionStatus: "Successfully added a student to a section"})
             } else {
                this.setState({ addStudentToSectionStatus: "Couldn't successfully add a student to a section"})
             }
          })
    }

    render (){
      return (
        <div className="w-100 h-100 bg-light text-dark fs-5">
            <Navbar bg="light" expand="lg" fixed="top">
                <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Nav>
                    <Nav.Link href="/admin/logout">Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="w-100 p-5 h-100 bg-light text-dark">
                <form onSubmit={this.handleAddStudent}>
                    <br></br>
                    Add a student:
                    <Container>
                        <Row className="mt-3 mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Student Email" name="student_email"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Student Username" name="username"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Student Password" name="student_password"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="First Name" name="first_name"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Last Name" name="last_name"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="University" name="university"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Academic year" name="academic_year"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Major" name="major"></FormControl>
                            </InputGroup>
                        </Row>
                    </Container>
                    <Button type="submit" variant="secondary"> Add student </Button>
                    <br></br>
                    {this.state.addStudentStatus}
                </form>
                <form onSubmit={this.handleAddSection}>
                    <br></br>
                    Add a section:
                    <Container>
                        <Row className="mt-3 mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section Name" name="section_name"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section cohort" name="section_cohort"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section semester" name="section_semester"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section code" name="section_code"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section Professor" name="section_professor"></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section Time" name="section_time"></FormControl>
                            </InputGroup>
                        </Row>
                    </Container>
                    <Button type="submit" variant="secondary"> Add section </Button>
                    <br></br>
                    {this.state.addSectionStatus}
                </form>
                <form onSubmit={this.handleAddStudentToSection}>
                    <br></br>
                    Add a student to a section:
                    <Container>
                        <Row className="mt-3 mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Students email or username" name="student_email" defaultValue=""></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Section code" name="section_code" defaultValue=""></FormControl>
                            </InputGroup>
                        </Row>
                    </Container>
                    <Button type="submit" variant="secondary"> Add student to section </Button>
                    <br></br>
                </form>
                <h5>{this.state.addStudentToSectionStatus}</h5>
                <form onSubmit={this.handleAddClass}>
                    <br></br>
                    Add a class:
                    <Container>
                        <Row className="mt-3 mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Class name" name="class_name" defaultValue=""></FormControl>
                            </InputGroup>
                        </Row>
                        <Row className="mb-3 mlr-300">
                            <InputGroup>
                                <FormControl placeholder="Class code" name="code" defaultValue=""></FormControl>
                            </InputGroup>
                        </Row>
                    </Container>
                    <Button type="submit" variant="secondary"> Add class </Button>
                    <br></br>
                </form>
                <h5>{this.state.addClassStatus}</h5>
            </div>
        </div>
      )
    }
  }

  export default AdminProfile;