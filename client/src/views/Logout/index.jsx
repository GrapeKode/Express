import React, { Component } from 'react'

import AuthHelperMethods from '../../components/auth/HelperMethods.jsx'

export default class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = props
  }

  componentDidMount() {
    const Auth = new AuthHelperMethods()
    Auth.logout()
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }

  render() {
    return (
      <div className="flex-center" style={{width: '100vw', height: '100vh'}}>
        <div className="text-success">
          Logged out successfully
        </div>
      </div>
    )
  }
}