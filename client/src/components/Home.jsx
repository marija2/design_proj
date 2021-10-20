import React from "react";
import { Redirect } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import postRequest from "./PostRequest"

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = { redirect: false }

        postRequest('/session', {}
        ).then(data => {
            // console.log(session)
            if (data.success === false) {
                this.state = { redirect: "/login" }
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
                the html for the main page will be here
            </div>
        )
    }
}

export default Home;
