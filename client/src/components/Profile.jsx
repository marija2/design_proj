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
      this.state = { redirect: false }
      this.handleSubmit = this.handleSubmit.bind(this);
      console.log("in profile")

    }
  
    handleSubmit(e) {
      e.preventDefault();
  
      postRequest('/login', {
        username: e.target.username.value,
        password: e.target.password.value }
      ).then(data => {
        console.log(data)
        if (data.success === true) {
          this.setState({ redirect: "/" });
        }
      })
    }
  
    render (){
      return (<div>
        the html for the profile page will be here
      </div>
      )
    }
  }

  export default Profile;