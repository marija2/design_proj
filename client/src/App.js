import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Logout } from './components';
import { Login } from './components';
import { Home } from './components';
import { Profile } from './components';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Switch>
          <Route path="/logout" exact component={() => <Logout />} />
          <Route path="/" exact component={() => <Home />} />
          <Route path="/login" exact component={() => <Login />} />
          <Route path="/profile" exact component={() => <Profile />} />
        </Switch>
      </Router>
      </header>
    </div>
  );
}

export default App;
