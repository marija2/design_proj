import React from "react";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

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
          my_id: data.my_id // this is my id, so I can friend/unfriend this person
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
        <div>
          <h1> {this.state.first_name} {this.state.last_name}</h1>
          <form onSubmit={this.handleSubmit}>
          <InputGroup>
              <FormControl
                placeholder="First Name"
                name="first_name"
                defaultValue={this.state.first_name}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Last Name"
                name="last_name"
                defaultValue={this.state.last_name}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Preferred Name"
                name="preferred_name"
                defaultValue={this.state.preferred_name}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Pronouns"
                name="pronouns"
                defaultValue={this.state.pronouns}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Email"
                name="email"
                defaultValue={this.state.email}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="University"
                name="university"
                defaultValue={this.state.university}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Academic year"
                name="academic_year"
                defaultValue={this.state.academic_year}>
              </FormControl>
            </InputGroup>
            <InputGroup>
              <FormControl
                placeholder="Major"
                name="major"
                defaultValue={this.state.major}>
              </FormControl>
            </InputGroup>
            <Button type="submit" > Save changes </Button>
            <Button type="button" onClick={this.handleEditButtonClicked}> Cancel </Button>
          </form>
        </div>
      )
    }

    getPrefferedName() {
      if (this.state.preferred_name !== "") {
        return (<h5> Preferred name: {this.state.preferred_name} </h5>)
      }
    }

    getPronouns() {
      if (this.state.pronouns !== "") {
        return (<h5> Pronouns: {this.state.pronouns} </h5>)
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
      return (<Button onClick={() => {this.handleUnFriend(id)}}>Unfriend</Button>)
    }
 
    getFriend(friend) {
      return (
        <div>
          <a href={`/profile/${friend.username}`}>
            {friend.first_name} {friend.last_name}
          </a>
          {this.getUnfriendBtn(friend.id)}
          <br></br>
        </div>
      )
    }

    getFriends() {
      if (!this.state.friends) return
      let result = [<h5> Friends </h5>]
      for (var i = 0; i < this.state.friends.length; i++) {
        result[i + 1] = this.getFriend(this.state.friends[i])
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
      return (<Button onClick={()=>{this.handleDrop(id)}}>Drop</Button>)
    }

    getSection(section) {
      return(
      <div>
        <a href={`/section/${section.code}`}>
          {section.section_name} {section.semester} {section.cohort}
        </a>
        {this.getDropBtn(section.id)}
        <br></br>
      </div>
      )
    }

    getSections() {
      if (!this.state.sections) return
      let result = [<h5> Sections </h5>]
      for (var i = 0; i < this.state.sections.length; i++) {
        result[i + 1] = this.getSection(this.state.sections[i])
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
        return (<Button onClick={this.handleUnfriend}> Unfriend </Button>)
      } else {
        return (<Button onClick={this.handleFriend}> Friend </Button>)
      }
    }

    renderEditBtn() {
      if (this.state.editable) {
        return (<Button onClick={this.handleEditButtonClicked}>Edit profile</Button>)
      }
    }

    renderProfile() {
      return (
        <div>
          <h1> {this.state.first_name} {this.state.last_name}</h1>
          {this.getPrefferedName()}
          {this.getPronouns()}
          <h5> {this.state.username} </h5>
          <h5> {this.state.email} </h5>
          <h5> {this.state.university} </h5>
          <h5> {this.state.academic_year} </h5>
          <h5> {this.state.major} </h5>
          {this.getFriendStatus()}
          {this.renderEditBtn()}
          {this.getSections()}
          {this.getFriends()}
      </div>
      )
    }
  
    render (){
      if (this.state.edit === true) { return this.renderProfileEditMode() }
      else { return this.renderProfile() }
    }
  }

  export default Profile;