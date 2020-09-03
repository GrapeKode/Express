import React, { Component } from 'react'

import validate from '../../components/validators/validate.js'
import _ from 'underscore'

import schema from './schema'

import SignUpContainer from './SignUpContainer.jsx'

class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        policy: false
      },
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        policy: false
      },
      errors: {
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        policy: null
      },
      isValid: false,
      isLoading: false,
      submitError: null
    }
    this.signUp = this.signUp.bind(this)
    this.validateForm = this.validateForm.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
  }

  signUp(...data) {
    console.log('DATA:', data)
    alert(`DATA: ${JSON.stringify(data)}`)
    const sendData = Object.keys(data).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&')

    fetch('http://localhost:5000/auth/signup', {
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
      console.log('RES:', res)
      return res.json()
    }).then(doc => {
      console.log('DOC:', doc)
      if( doc.hasOwnProperty('error') )
        this.setState({ submitError: doc.error.message })
      else
        this.setState({ submitError: false })
    })
  }

  validateForm = _.debounce(() => {
    const { values } = this.state

    const newState = { ...this.state }
    const errors = validate(values, schema)

    newState.errors = errors || {}
    newState.isValid = errors ? false : true

    this.setState(newState)
  }, 300)

  handleFieldChange(event) {
    const { name, value, type, checked } = event.target
    const newState = { ...this.state }

    newState.submitError = null
    newState.touched[name] = true
    newState.values[name] = type === 'checkbox' ? checked : value

    this.setState(newState, this.validateForm)
  }

  async handleSignUp(event) {
    if ( typeof this.handleSignUp.counter == 'undefined' ) {
      this.handleSignUp.counter = 0;
    }
    const { values, isValid } = this.state

    this.setState({ isLoading: true })
    event.preventDefault();

    if( !isValid ) {
      this.handleSignUp.counter++
      if( this.handleSignUp.counter === 3 )
        this.setState({ submitError: 'Are you dumb? All fields are required!' })
      else 
        this.setState({ submitError: 'All fields are required' })
      this.setState({ isLoading: false })
    } else {
      this.handleSignUp.counter = 0
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password
      }
      const sendData = Object.keys(data).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&')
      
      await fetch('http://localhost:5000/auth/signup', {
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
          setTimeout(() => {
            window.location.href = '/sign-in'
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
    } = this.state

    const showFirstNameError = 
      touched.firstName && errors.firstName ? errors.firstName : false
    const showLastNameError =
      touched.lastName && errors.lastName ? errors.lastName : false;
    const showEmailError =
      touched.email && errors.email ? errors.email : false;
    const showPasswordError =
      touched.password && errors.password ? errors.password : false;
    const showPolicyError =
      touched.policy && errors.policy ? errors.policy : false;

    return (
      <SignUpContainer 
        showFirstNameError={showFirstNameError}
        showLastNameError={showLastNameError}
        showEmailError={showEmailError}
        showPasswordError={showPasswordError}
        showPolicyError={showPolicyError}
        
        values={values}
        isValid={isValid}
        submitError={submitError}
        isLoading={isLoading}

        handleFieldChange={this.handleFieldChange}
        handleSignUp={this.handleSignUp}
        handleAlertMessages={this.handleAlertMessages}
      />
    )
  }
}

export default SignUp;
