import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import RestrictSecureRoute from './components/auth/RestrictSecureRoute.jsx'

import SignUp from './views/SignUp'
import SignIn from './views/SignIn'
import UserList from './views/Users'
import NotFound from './views/NotFound'
import Dashboard from './views/Dashboard'
import Logout from './views/Logout'
import Account from './views/Account'
import Settings from './views/Settings'

export default class Routes extends Component {

  render() {
    return (
      <Switch>
        <Redirect
          exact
          from="/"
          to="/dashboard"
        />
        <Route
          component={RestrictSecureRoute(Dashboard)}
          exact 
          path="/dashboard"
        />
        <Route
          component={RestrictSecureRoute(UserList)}
          exact 
          path="/users"
        />
        <Route
          component={SignUp}
          exact 
          path="/sign-up"
        />
        <Route
          component={SignIn}
          exact 
          path="/sign-in"
        />
        <Route
          component={RestrictSecureRoute(Logout)}
          exact
          path="/logout"
        />
        <Route 
          component={RestrictSecureRoute(Settings)}
          exact
          path="/settings"
        />
        <Route 
          component={RestrictSecureRoute(Account)}
          exact
          path="/account"
        />
        <Route
          component={NotFound}
          exact 
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}
