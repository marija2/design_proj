import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

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

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = { redirect: false }

        postRequest('/session', {}
        ).then(data => {
            console.log(data)
            if (data.success === false) {
                this.setState({ redirect: "/login"});
            }
            else {
                this.setState({
                    name: "Marija"
                })
            }
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div class="w-100">
                <Navbar bg="light" expand="lg">
                <Container>
                    <Nav className="me-auto">
                        <Nav.Link href="/logout">Sign out</Nav.Link>
                    </Nav>
                </Container>
                </Navbar>
                <Container> Welcome {this.state.name} </Container>
            </div>
        )
    }
}

export default Home;
