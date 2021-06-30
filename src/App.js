import './App.css';
import React from 'react';
import Classes from './Classes.js'
import Schedule from './Schedule.js';
import Settings from './Settings.js'
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import { Route, BrowserRouter as Router } from 'react-router-dom'


function App() {
  return (
    <Router>
      <Route path="/" exact component={Schedule}></Route>
      <Route path="/classes" component={Classes}></Route>
      <Route path="/settings" component={Settings}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/signin" component={SignIn}></Route>
    </Router>
  );
}

export default App;