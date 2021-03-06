import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions'
import { Provider } from 'react-redux';
import store from './store'

import './App.css';

import PrivateRoute from './components/common/PrivateRoute'

//components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import { clearCurrentProfile } from './actions/profileActions';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

//check for tokens
if (localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // decode token
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticaded
  store.dispatch(setCurrentUser(decoded));

  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //LogoutUser
    store.dispatch(logoutUser());
    //clear 
    store.dispatch(clearCurrentProfile());
    //redirect
    window.location.href = '/login'
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
        <div className="App">
          <Navbar/>
          <Route exact path="/" component={Landing}/>
          <div className="container">
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard}/>
              <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
              <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
              <PrivateRoute exact path="/add-experience" component={AddExperience}/>
              <PrivateRoute exact path="/add-education" component={AddEducation}/>
              <PrivateRoute exact path="/feed" component={Posts}/>
              <PrivateRoute exact path="/post/:id" component={Post}/>
            </Switch>
            <Route exact path="/profiles" component={Profiles}/>
            <Route exact path="/profile/:handle" component={Profile}/>
            <Route exact path="/not-found" component={NotFound}/>
          </div>
          <Footer/>
        </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
