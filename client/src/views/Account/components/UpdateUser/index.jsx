import React, { Component } from 'react'

import _ from 'underscore'
import schema from './schema'

export default class UpdateImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        firstName: '',
        lastName: '',
        email: '',
        isAdmin: false
      },
      touched: {
        firstName: false,
        lastName: false,
        email: false,
        isAdmin: false
      },
      errors: {
        firstName: null,
        lastName: null,
        email: null
      },
      submitError: null,
      isValid: false,
      isLoading: false
    }

    // BINDS
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillReceiveProps() {
    this.setState(prev => {
      const newState = this.state

      newState.values.firstName = this.props.firstName
      newState.values.lastName = this.props.lastName
      newState.values.email = this.props.email
      newState.values.isAdmin = false

      return newState
    })
  }

  validateForm = _.debounce(() => {
    const { values } = this.state

    const newState = { ...this.state }
    const errors = this.props.validate(values, schema)

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

    this.setState( newState, this.validateForm)
  }

  async handleSubmit(event) {
    event.preventDefault()

    const { _id, isAdmin, helper, handleMessages } = this.props
    const { values, touched } = this.state
    const Helper = new helper()

    values.isAdmin = values.isAdmin ? !isAdmin : isAdmin

    const data = Object.keys(values).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(values[key])
    }).join('&')

    await Helper.updateUser(_id, data)
      .then(doc => {
        if( doc.hasOwnProperty('error') ) {
          handleMessages(doc.error.message, 'danger', 'User Details:')
        } else {
          handleMessages('has been updated successfully', 'success', 'User Details')
          setTimeout(() => {
              window.location.href = '/account'
          }, 1500)
        }
      })
      .catch(err => {
        console.error('ERROR_UPDATE', err)
        handleMessages(JSON.stringify(err), 'danger', 'Critical Error')
      })
  }

  fieldErrorMessages(message, typeClass='danger', title='') {
    const classes = `text-${typeClass}`
    return (
      <small className={classes}> 
        <strong className='mr-1'>{title}</strong> 
         {message}
      </small>
    )
  }

  render() {
    const {
      _id, 
      email, 
      isAdmin, 
      firstName, 
      lastName, 
      imageURL, 
      uploadDate, 
      metadata
    } = this.props

    const { 
      values, 
      touched, 
      errors,
      submitError,
      isValid,
      isLoading
    } = this.state

    const showFirstNameError = 
      touched.firstName && errors.firstName ? errors.firstName : false
    const showLastNameError =
      touched.lastName && errors.lastName ? errors.lastName : false;
    const showEmailError =
      touched.email && errors.email ? errors.email : false;

    let submitButton = null

    if( isValid ) {
      submitButton = 
        <button
          type="submit"
          className="btn btn-info btn-block leaf text-uppercase"
        >
          Save Details
        </button>
    }
    if( isLoading ) {
      submitButton = 
        <button
          type="button"
          className="btn btn-outline-secondary btn-block leaf text-uppercase"
          disabled
        >
          <span style={{marginRight: '10px'}} className="spinner-border spinner-border-sm text-info"></span>
          Loading...
        </button>
    } else if( !isValid ) {
      submitButton = 
        <button
          type="button"
          className="btn btn-outline-secondary btn-block leaf text-uppercase"
          disabled
        >
          Save Details
        </button>
    }

    return (
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">
            Profile 
            <small className="card-text ml-3" style={{fontSize: '14px'}}>The information can be edited</small>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={this.handleSubmit}>
            {showFirstNameError && this.fieldErrorMessages(showFirstNameError, 'danger', 'First Name')}
            <div className="input-group mb-3">
              <input 
                type="text" 
                name='firstName' 
                className="form-control"
                placeholder="First Name"
                autoComplete="off"
                onChange={this.handleFieldChange}
                value={values.firstName}
                />
            </div>
            {showLastNameError && this.fieldErrorMessages(showLastNameError, 'danger', 'Last Name')}
            <div className="input-group mb-5">
              <input 
                type="text" 
                name='lastName' 
                className="form-control"
                placeholder="Last Name"
                autoComplete="off"
                onChange={this.handleFieldChange}
                value={values.lastName}
                />
            </div>

            {showEmailError && this.fieldErrorMessages(showEmailError, 'danger', 'Email')}
            <div className="input-group mb-3">
              <input 
                type="email" 
                name='email' 
                className="form-control"
                placeholder="Email"
                autoComplete="off"
                onChange={this.handleFieldChange}
                value={values.email}
                />
            </div>
            {
              isAdmin && 
              <div className="custom-control custom-switch text-danger text-left mb-5">
                <input 
                  type="checkbox" 
                  name="isAdmin"
                  className="custom-control-input" 
                  id="isAdmin"  
                  checked={values.isAdmin}
                  onChange={this.handleFieldChange}
                />
                <label className="custom-control-label" htmlFor="isAdmin">
                  {!isAdmin ? 'Upgrade to Admin' : 'Downgrade to Member'}
                </label>
              </div>
            }

            {submitButton}
          </form>
        </div>
      </div>
    )
  }
}