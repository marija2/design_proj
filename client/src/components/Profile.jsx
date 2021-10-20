import React from "react";
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

class Profile extends React.Component{
    constructor(props) {
      super(props)
      this.state = {
        redirect: false,
        editting: false
      }
      this.handleSubmit = this.handleSubmit.bind(this);
      console.log("in profile")
      console.log(props.data)
      // will get this info from the login page
      // need to get info from db if not comping to this page from login page
      this.state = {
        email: props.data.email,
        first_name: props.data.first_name,
        last_name: props.data.last_name,
        preferred_name: props.data.preferred_name,
        pronouns: props.data.pronouns,
        university: props.data.university,
        academic_year: props.data.academic_year,
        major: props.data.major
      }
    }
  
    // should call this methos when a form with new info is submitted
    handleSubmit(e) {
      e.preventDefault();
  
      postRequest('/editProfile', {
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
            editting: false
          });
        }
      })
    }

    // call this method when the edit button is clicked
    // the edit button will be in renderProfile()
    handleEditButtonClicked() {
      this.setState({
        editting: true
      })
    }

    renderProfileEditMode() {
      // TO DO
      return (
        <div>
        the html for the profile page will be here with an edit form
      </div>
      )
    }

    renderProfile() {
      // TO DO
      return (
        <div>
        the html for the profile page will be here
      </div>
      )
    }
  
    render (){
      if (this.states.editting == true) {
          return this.renderProfileEditMode()
      } else {
        return this.renderProfile()
      }
    }
  }

  export default Profile;