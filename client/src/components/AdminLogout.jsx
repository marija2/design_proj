import React from "react";
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";
import postRequest from "./PostRequest"

class AdminLogout extends React.Component{

  constructor(props) {
    super(props)
    this.state = { redirect: false }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    postRequest('/admin/logout', {
      username: "someval",
      password: "someval" }
    ).then(data => {
      if (data.success === true) {
        this.setState({ redirect: "/admin/login" })
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

export default AdminLogout;