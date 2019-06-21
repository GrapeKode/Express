import React, { Component } from 'react'

import _ from 'underscore'
import schema from './schema'
// import validate from '../../../../components/validators/validate'

export default class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        isAdmin: false
      },
      touched: {
        email: false,
        password: false,
      },
      errors: {
        email: null,
        password: null
      },
      isValid: false,
      submitError: null,
      isLoading: false
    }
    
    // Binds
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.validateForm = this.validateForm.bind(this)
  }

  validateForm = _.debounce(() => {
    const { values } = this.state
    
    const newState = { ...this.state }
    const errors = this.props.validate(values, schema)

    newState.errors = errors || {}
    newState.isValid = errors ? false : true 

    this.setState( newState )
  }, 300)

  async handleFieldChange(event) {
    const { value, name, type, checked } = event.target

    const newState = { ...this.state }

    newState.submitError = null
    newState.touched[name] = true
    newState.values[name] = type === 'checkbox' ? checked : value

    this.setState( newState, this.validateForm )
  }

  async handleFormSubmit(event) {

    event.preventDefault()
    this.setState({ isLoading: true })

    if( typeof this.handleFormSubmit.counter == 'undefined' )
      this.handleFormSubmit.counter = 0

    const helper = new this.props.helper()

    const { values, isValid } = this.state

    if( !isValid ) {
      this.handleFormSubmit.counter++;
      if( this.handleFormSubmit.counter % 3 === 0 ) 
        this.setState({ submitError: "Why are you trying to submit the form if you didn't complete the required fields?" })
      else
        this.setState({ submitError: 'Email and password is required.' })
      this.setState({ isLoading: false })
    } else {
      const encodeData = Object.keys(values).map(key => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(values[key])
      }).join('&')

      await helper.createUser(encodeData)
        .then(doc => {
          if( doc.hasOwnProperty('error') ) {
            this.setState({ submitError: doc.error.message })
          } else {
            this.setState({ submitError: false })
          }
          this.setState({ isLoading: false })
        })
        .catch(err => {
          console.log(err)
          this.setState({
            isLoading: false,
            submitError: JSON.stringify(err)
          })
        })
    }
  }

  handleAlertMessages(message, className='danger', title='') {
    const color = `text-${className}`
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

    const showEmailError = touched.email && errors.email
    const showPasswordError = touched.password && errors.password

    let submitButton, submitInfo = '';
    // alert(`LOADING: ${props.isLoading}`)

    if( isValid ) {
      submitButton = 
        <button
          type="submit"
          className="btn btn-primary btn-block leaf text-uppercase"
        >
          Create User
        </button>
    } 
    if( isLoading ) {
      submitButton = 
        <button
          type="button"
          className="btn btn-outline-secondary btn-block leaf text-uppercase disabled"
          disabled
        >
          <span style={{marginRight: '10px'}} className="spinner-border spinner-border-sm text-info"></span>
          Loading...
        </button>
    } else if( !isValid ) {
      submitButton = 
        <button
          type="submit"
          className="btn btn-outline-secondary btn-block leaf text-uppercase"
          disabled
        >
          Create User
        </button>
    }

    if( submitError ) {
      submitInfo = 
        <div className="text-left alert alert-danger alert-dismissible">
          {submitError}
        </div>
    } else if( submitError === false ) {
      submitInfo = 
        <div className="text-left alert alert-success alert-dismissible">
          Account created successfully
        </div>
    }

    return (
      <span>
        <div className="modal fade" id="addUser">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h3 className="modal-title">Add new account</h3>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  {submitInfo}
                </div>

                <form onSubmit={this.handleFormSubmit} className="text-left">
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input 
                      type="text" 
                      name="firstName" 
                      className="form-control" 
                      placeholder="First Name" 
                      value={values.firstName}
                      onChange={this.handleFieldChange}
                    />
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input 
                      type="text" 
                      name="lastName"
                      className="form-control" 
                      placeholder="Last Name"
                      value={values.lastName}  
                      onChange={this.handleFieldChange}
                    />
                  </div>
                  { showEmailError && this.handleAlertMessages(showEmailError, 'danger', 'Email') }
                  <div className="input-group mb-3">
                    <input 
                      type="text" 
                      name="email"
                      className="form-control" 
                      placeholder="Email"  
                      value={values.email}
                      onChange={this.handleFieldChange}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-at"></i></span>
                    </div>
                  </div>
                  { showPasswordError && this.handleAlertMessages(showPasswordError, 'danger', 'Password') }
                  <div className="input-group mb-3">
                    <div className="input-group-prepend">
                      <span className="input-group-text"><i className="fas fa-lock"></i></span>
                    </div>
                    <input 
                      type="password" 
                      name="password"
                      className="form-control" 
                      placeholder="Password" 
                      value={values.password} 
                      onChange={this.handleFieldChange}
                    />
                  </div>
                  { // Members don't have access to add an ADMIN
                    this.props.isAdmin && 
                    <div className="custom-control custom-switch text-left mb-3">
                      <input 
                        type="checkbox" 
                        name="isAdmin"
                        className="custom-control-input" 
                        id="isAdmin"  
                        checked={values.isAdmin}
                        onChange={this.handleFieldChange}
                      />
                      <label className="custom-control-label" htmlFor="isAdmin">
                        {values.isAdmin ? 'Admin' : 'Member'}
                      </label>
                    </div>
                  }
                  {submitButton}
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>

            </div>
          </div>
        </div>
        <button 
          className="btn btn-outline-info text-uppercase ml-3"
          onClick={this.handleAddUser}
          data-toggle="modal" 
          data-target="#addUser"
        >Add</button>
      </span>
    )
  }
}