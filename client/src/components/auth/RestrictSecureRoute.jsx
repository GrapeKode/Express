import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import AuthHelperMethods from './HelperMethods.jsx'

export default function RestrictSecureRoutes(RedirectLink) {
  return class extends Component {
    constructor() {
      super()
      this.state = {
        response: {
          status: 200,
          message: 'Logged in',
          user: {
            _id: '',
            email: '',
            isAdmin: false
          }
        },
        isLoading: true,
        redirect: false
      }
    }

    componentDidMount() {
      const Auth = new AuthHelperMethods()
      const token = Auth.getToken()
      Auth.getCurrentUser(token).then(doc => {
        const newState = { ...this.state.response }
        // console.log('DOC___:', doc)
        if( doc.hasOwnProperty('status') ) {
          this.setState({ redirect: true }) //  response: { ...doc },
        } else {
          newState.user = { ...doc.user }
          this.setState({response: { ...newState }})
        }
        this.setState({ isLoading: false })
      })
    }

    render() {
      const { isLoading, redirect } = this.state
      // alert(`isLoading: ${isLoading}; Redirect: ${redirect}`)
      if( isLoading ) {
        return null
      }
      if( redirect ) {
        return <Redirect to='/sign-in' />
      }

      return (
        <React.Fragment>
          <RedirectLink {...this.state.response} />
        </React.Fragment>
      ) 
    }
  }
}