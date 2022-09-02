import './App.css';
import React from 'react';
import Classes from './Classes.js'
import Schedule from './Schedule.js';
import Settings from './Settings.js'
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import Lunches from './Lunches.js';
import Announcements from './Announcements.js';
import Friends from './Friends.js';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Schedule}></Route>
        <Route path="/classes" component={Classes}></Route>
        <Route path="/settings" component={Settings}></Route>
        <Route path="/signup" component={SignUp}></Route>
        <Route path="/signin" component={SignIn}></Route>
        <Route path="/lunches" component={Lunches}></Route>
        <Route path="/friends" exact component={Friends}></Route>
        <Route path="/friend/:id" component={Schedule}></Route>
        <Route path="/announcements" component={Announcements}></Route>
      </Switch>
    </Router>
  );
}

export default App;