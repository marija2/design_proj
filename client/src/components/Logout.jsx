import React from "react";
import Button from 'react-bootstrap/Button';
import { Redirect } from "react-router-dom";

async function postRequest(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

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