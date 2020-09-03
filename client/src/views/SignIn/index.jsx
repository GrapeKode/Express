import React, { Component } from 'react'

import validate from '../../components/validators/validate.js'
import _ from 'underscore'
import schema from './schema'
import AuthHelperMethods from '../../components/auth/HelperMethods.jsx'

import SignInContainer from './SignInContainer.jsx'

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        email: '',
        password: '',
        remember: false
      },
      touched: {
        email: false,
        password: false
      },
      errors: {
        email: null,
        password: null
      },
      isValid: false,
      isLoading: false,
      submitError: null
    }
    this.validateForm = this.validateForm.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
  }

  validateForm = _.debounce(() => {
    const { values } = this.state
  
    const newState = { ...this.state }
    const errors = validate(values, schema)

    newState.errors = errors || {}
    newState.isValid = errors ? false : true

    this.setState( newState )
  }, 300)

  handleFieldChange(event) {
    const { name, value, type, checked } = event.target
    const newState = { ...this.state }

    newState.submitError = null
    newState.touched[name] = true
    newState.values[name] = type === 'checkbox' ? checked : value

    this.setState( newState, this.validateForm )
  }

  async handleSignIn(event) {
    event.preventDefault();
    const Auth = new AuthHelperMethods()

    if ( typeof this.handleSignIn.counter == 'undefined' ) {
      this.handleSignIn.counter = 0;
    }
    const { values, isValid } = this.state

    this.setState({ isLoading: true })

    if( !isValid ) {
      this.handleSignIn.counter++;
      if( this.handleSignIn.counter % 3 === 0 ) 
        this.setState({ submitError: "Why are you trying to submit the form if you didn't complete the required fields?" })
      else
        this.setState({ submitError: 'All fiedls are required' })
      this.setState({ isLoading: false })
    } else {
      const data = {
        email: values.email,
        password: values.password
      }
      const sendData = Object.keys(data).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(values[key])
      }).join('&')

      await fetch('/auth/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        referrer: 'no-referrer',
        body: sendData
      }).then(res => {
        return res.json()
      }).then(doc => {
        if( doc.hasOwnProperty('error') )
          this.setState({ submitError: doc.error.message })
        else {
          this.setState({ submitError: false })
          Auth.setToken(doc.token)
          setTimeout(() => {
            window.location.href = '/'
          }, 500)
        }
        this.setState({ isLoading: false })
      }).catch(err => {
        this.setState({
          isLoading: false,
          submitError: JSON.stringify(err)
        })
      })
    }
  }

  handleAlertMessages(message, className='danger', title='') {
    const color = `text-${className} mr-5`
    return(
      <small className={color}> 
        <strong className='mr-1'>{title}</strong> 
         {message}
      </small>
    )
  }

  render() {
    const {
      values,
      touched,
      errors,
      isValid,
      submitError,
      isLoading
    } = this.state;
    const showEmailError = touched.email && errors.email;
    const showPasswordError = touched.password && errors.password;

    return (
      <SignInContainer
        showEmailError={showEmailError}
        showPasswordError={showPasswordError}
        values={values}
        isValid={isValid}
        submitError={submitError}
        isLoading={isLoading}
        handleFieldChange={this.handleFieldChange}
        handleSignIn={this.handleSignIn}
        handleAlertMessages={this.handleAlertMessages}
      />
    )
  }
}