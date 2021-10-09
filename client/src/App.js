import React from "react";
import "./App.css";

import 'bootstrap/dist/css/bootstrap.css';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

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

function SignInForm() {
  function handleSubmit(e) {
    e.preventDefault();

    postRequest('/login', {
      username: e.target.username.value,
      password: e.target.password.value }
    ).then(data => {
      console.log(data)
    })


    console.log(e.target.username.value)    
  }

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <Row class="p-3">
          <InputGroup>
            <FormControl
              placeholder="Username"
              name="username">
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SignInForm></SignInForm>
      </header>
    </div>
  );
}

export default App;
