import React from "react";
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

class Logout extends React.Component{

  constructor(props) {
    super(props)
    this.state = { redirect: false }
    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    if (this.state.redirect) { return <Redirect to={this.state.redirect} /> }
    return (
      <form onSubmit={this.handleSubmit}>
        <Button type="submit" > Log out </Button>
      </form>
    )
  }
}

export default Logout;