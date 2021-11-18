import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Logout } from './components';
import { Login } from './components';
import { Home } from './components';
import { Profile } from './components';
import { AdminLogin } from './components';
import { AdminLogout } from './components';
import { AdminProfile } from './components';
import { Section } from './components';
import { Messages } from './components'

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Switch>
          <Route path="/logout" exact component={() => <Logout />} />
          <Route path="/" exact component={() => <Home />} />
          <Route path="/login" exact component={() => <Login />} />
          <Route path="/messages/:username" exact component={(e) => <Messages data={e.match.params}/>} />
          <Route path="/profile/:username" exact component={(e) => <Profile data={e.match.params}/>} />
          <Route path="/admin/login" exact component={() => <AdminLogin />} />
          <Route path="/admin/logout" exact component={() => <AdminLogout />} />
          <Route path="/admin/profile/:email" exact component={(e) => <AdminProfile data={e.match.params}/>} />
          <Route path="/section/:code" exact component={(e) => <Section data={e.match.params}/>} />
        </Switch>
      </Router>
      </header>
    </div>
  );
}

export default App;
