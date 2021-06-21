import './App.css';
import React from 'react';
import Classes from './Classes.js'
import Schedule from './Schedule.js';
import Settings from './Settings.js'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
function App() {
  return(
    <Router>
      <Route path = "/" exact component = {Schedule}></Route>
      <Route path = "/classes" component = {Classes}></Route>
      <Route path = "/settings" component = {Settings}></Route>
    </Router>
  );
}
function Home() {
  return (
    <div className="App">
      <Schedule/>
    </div>
  );
}

export default App;