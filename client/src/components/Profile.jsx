import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import postRequest from "./PostRequest"
import Card from 'react-bootstrap/Card';

import "./Profile.css";

class Profile extends React.Component{
    constructor(props) {
      super(props)

      this.state = {
        redirect: false,
        edit: false,
        username: props.data.username
      }

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleEditButtonClicked = this.handleEditButtonClicked.bind(this);
      this.handleDrop = this.handleDrop.bind(this);
      this.handleUnfriend = this.handleUnfriend.bind(this);
      this.handleFriend = this.handleFriend.bind(this);

      // need to get info from db
      postRequest('/profile', {
        username: props.data.username
      }).then(data => {
        if (data.success === false) return
        
        this.setState({
          id: data.result.id,
          first_name: data.result.first_name,
          last_name: data.result.last_name,
          email: data.result.email,
          preferred_name: data.result.preferred_name || "",
          pronouns: data.result.pronouns || "",
          university: data.result.university,
          academic_year: data.result.academic_year,
          major: data.result.major,
          friends: data.friends,
          sections: data.sections,
          editable: data.editable, // will be editable if you are looking at your own profile
          friend: data.friend, // will be true if this person is my friend
          my_id: data.my_id, // this is my id, so I can friend/unfriend this person
          my_username: data.my_username
        })
      })
    }
  
    // should call this methos when a form with new info is submitted
    handleSubmit(e) {
      e.preventDefault();

      postRequest('/editProfile', {
        username: this.state.username,
        email: e.target.email.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        preferred_name: e.target.preferred_name.value,
        pronouns: e.target.pronouns.value,
        university: e.target.university.value,
        academic_year: e.target.academic_year.value,
        major: e.target.major.value
      }).then(data => {
        console.log(data)
        if (data.success === true) {
          this.setState({
            email: data.result.email,
            first_name: data.result.first_name,
            last_name: data.result.last_name,
            preferred_name: data.result.preferred_name,
            pronouns: data.result.pronouns,
            university: data.result.university,
            academic_year: data.result.academic_year,
            major: data.result.major,
            edit: false
          });
        }
      })
    }

    // call this method when the edit button is clicked
    // the edit button will be in renderProfile()
    handleEditButtonClicked() {
      this.setState({ edit: !this.state.edit })
    }

    renderProfileEditMode() {
      return (
        <div class="col-5">
          <form onSubmit={this.handleSubmit}>
          <Button type="submit"
                  size="sm"
                  variant="dark"
                  className="m-2">
                    Save
          </Button>
          <Button type="button"
                  size="sm"
                  variant="outline-dark"
                  onClick={this.handleEditButtonClicked}>
            Cancel
          </Button>
          <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="First Name"
                name="first_name"
                className="text-center"
                defaultValue={this.state.first_name}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Last Name"
                name="last_name"
                className="text-center"
                defaultValue={this.state.last_name}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Preferred Name"
                name="preferred_name"
                className="text-center"
                defaultValue={this.state.preferred_name}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Pronouns"
                name="pronouns"
                className="text-center"
                defaultValue={this.state.pronouns}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Email"
                name="email"
                className="text-center"
                defaultValue={this.state.email}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="University"
                name="university"
                className="text-center"
                defaultValue={this.state.university}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Academic year"
                name="academic_year"
                className="text-center"
                defaultValue={this.state.academic_year}>
              </FormControl>
            </InputGroup>
            <InputGroup size="sm" className="p-1">
              <FormControl
                placeholder="Major"
                name="major"
                className="text-center"
                defaultValue={this.state.major}>
              </FormControl>
            </InputGroup>
          </form>
        </div>
      )
    }

    getPrefferedName() {
      if (this.state.preferred_name !== "") {
        return (<h6> <any class="text-secondary">Preferred:</any> {this.state.preferred_name} </h6>)
      }
    }

    getPronouns() {
      if (this.state.pronouns !== "") {
        return (<h6> <any class="text-secondary">Pronouns:</any>  {this.state.pronouns} </h6>)
      }
    }

    handleUnFriend(id) {
      console.log(id)
      postRequest('/unfriend', {
        my_id: this.state.id,
        friends_id: id
      }).then(data => {
        if (data.success === false) return

        var new_friends = this.state.friends
        var found = false

        for(var i = 0; i < new_friends.length; i++) {
          if (new_friends[i].id == id) found = true;

          if (found && i != new_friends.length - 1) {
            new_friends[i] = new_friends[i + 1]
          }
        }

        new_friends.pop()

        this.setState({ friends: new_friends })
      })
    }

    getUnfriendBtn(id) {
      if (this.state.editable === false) return
      return (
          <Button size="sm"
                  variant="outline-secondary"
                  className="unfriend-btn"
                  onClick={() => {this.handleUnFriend(id)}}>
            x
          </Button>
      )
    }
 
    getFriend(friend) {
      return(
        <Card className="text-dark m-1">
            <Card.Body className="h6 m-0 p-2">
                  < a href={`/profile/${friend.username}`} class="text-dark text-decoration-none">
                    {friend.first_name} {friend.last_name}
                  </a>
                  {this.getUnfriendBtn(friend.id)}
            </Card.Body>
        </Card>
      )
    }

    getFriends() {
      if (!this.state.friends) return
      let result = []
      for (var i = 0; i < this.state.friends.length; i++) {
        result[i] = this.getFriend(this.state.friends[i])
      }
      return (
        <div>{result}</div>
      )
    }

    handleDrop(section_id) {
      postRequest('/drop', {
        student_id: this.state.id,
        section_id: section_id
      }).then(data => {
        if (data.success === false) return

        var new_sections = this.state.sections
        var found = false

        for(var i = 0; i < new_sections.length; i++) {
          if (new_sections[i].id == section_id) found = true;

          if (found && i != new_sections.length - 1) {
            new_sections[i] = new_sections[i + 1]
          }
        }

        new_sections.pop()

        this.setState({ sections: new_sections })
      })
    }

    getDropBtn(id) {
      if (this.state.editable === false) return
      return (
        <Button size="sm"
                variant="outline-secondary"
                className="unfriend-btn"
                onClick={()=>{this.handleDrop(id)}}>
          x
        </Button>
      )
    }

    getSection(section) {
      return(
        <Card className="text-dark m-1">
          <Card.Body className="h6 m-0 p-2">
          < a href={`/section/${section.code}`} class="text-dark text-decoration-none">
            {section.section_name} {section.semester} {section.cohort}
          </a>
          {this.getDropBtn(section.id)}
          </Card.Body>
      </Card>
      )
    }

    getSections() {
      if (!this.state.sections) return
      let result = []
      for (var i = 0; i < this.state.sections.length; i++) {
        result[i] = this.getSection(this.state.sections[i])
      }
      return (
        <div>{result}</div>
      )
    }

    handleUnfriend() {
      postRequest('/unfriend', {
        my_id: this.state.my_id,
        friends_id: this.state.id
      }).then(data => {
        if (data.success === false) return

        var new_friends = this.state.friends
        var found = false

        // remove the current in user from this users friends
        for(var i = 0; i < new_friends.length; i++) {
          if (new_friends[i].id == this.state.my_id) found = true;

          if (found && i != new_friends.length - 1) {
            new_friends[i] = new_friends[i + 1]
          }
        }

        new_friends.pop()

        this.setState({
          friends: new_friends,
          friend: false
        })
      })
    }

    handleFriend() {
      postRequest('/friend', {
        my_id: this.state.my_id,
        friends_id: this.state.id
      }).then(data => {
        if (data.success === false) return

        var new_friends = this.state.friends
        new_friends[new_friends.length] = data.result

        this.setState({ friends: new_friends, friend: true })
      })
    }

    getFriendStatus() {
      if (this.state.editable === true) return

      if (this.state.friend === true) {
        return (
          <div>
            <Button size="sm" variant="dark" onClick={this.handleUnfriend}>
              Unfriend
            </Button>
          </div>
        )
      } else {
        return (
          <div>
            <Button size="sm" variant="dark" onClick={this.handleFriend}>
              Friend
            </Button>
          </div>
        )
      }
    }

    renderEditBtn() {
      if (this.state.editable) {
        return (
          <div>
            <Button size="sm" variant="dark" onClick={this.handleEditButtonClicked}>
              Edit
            </Button>
          </div>
        )
      }
    }

    renderNavBar() {
      return (
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
      )
    }

    renderProfileInfo() {
      if (this.state.edit === true) {
        return (
          <div class="row h-40 pb-3 overflow-auto justify-content-md-center">
            {this.renderProfileEditMode()}
          </div>
        )
      } else {
        return(
        <div class="row h-40 pb-3 overflow-auto">
          <h2> {this.state.first_name} {this.state.last_name}</h2>
          <h6> {this.state.username} </h6>
              {this.getPrefferedName()}
              {this.getPronouns()}
              <h6> <any class="text-secondary">Email:</any> {this.state.email} </h6>
              <h6> <any class="text-secondary">Uni:</any> {this.state.university} </h6>
              <h6> <any class="text-secondary">Year:</any> {this.state.academic_year} </h6>
              <h6> <any class="text-secondary">Major:</any> {this.state.major} </h6>
          {this.getFriendStatus()}
          {this.renderEditBtn()}
        </div>
        )
      }
    }

    renderProfile() {
      return (
        <div className="w-100 h-100 bg-light text-dark fs-5">
          {this.renderNavBar()}
          <div className="w-100 mt-50 p-5 h-100 fixed-top bg-light text-dark">
              {this.renderProfileInfo()}
              <h5> Sections </h5>
              <div class="row h-25 pb-5 overflow-auto justify-content-md-center">
                <div class="col-5">
                  {this.getSections()}
                </div>
              </div>
              <h5> Friends </h5>
              <div class="row h-25 pb-5 overflow-auto justify-content-md-center">
                <div class="col-5">
                  {this.getFriends()}
                </div>
              </div>
          </div>
      </div>
      )
    }
  
    render (){
      return this.renderProfile()
    }
  }

  export default Profile;