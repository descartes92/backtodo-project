import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import SignUp from './components/SignUp'
import SignIn from './components/SignIn'

import './App.css';

function App() {
  return (
    <Router>



      <div className="App">

        <div className="app__aside">
          <img src="undraw_random_thoughts_xejj.png" style={{ width: "100%" }} alt="illustration" />
        </div>
        <div className="app__form">

          <div className="pageSwitcher" >
            <NavLink to="/sign-in" className="pageSwitcher__item pageSwitcher__item--active">Sign In</NavLink>
            <NavLink exact to="/" className="pageSwitcher__item pageSwitcher__item--active">Sign Up</NavLink>
          </div>

          <div className="formTitle">
            <NavLink to="/sign-in" className="formTitle__link formTitle__link--active">Sign In </NavLink>
            or
                      <NavLink to="/" className="formTitle__link formTitle__link--active">Sign Up</NavLink>
          </div>


          <Route exact path="/" component={SignUp}></Route>

          <Route path="/sign-in" component={SignIn}></Route>

        </div>



      </div>

    </Router>
  );
}

export default App;
