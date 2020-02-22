import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
  let submitButton, submitInfo = '';
  if( props.isValid ) {
    submitButton = 
      <button
        type="submit"
        className="btn btn-primary btn-block leaf text-uppercase"
      >
        Sign Up Now
      </button>
  }
  if( props.isLoading ) {
    submitButton = 
      <button
        type="button"
        className="btn btn-outline-secondary btn-block leaf text-uppercase disabled"
        disabled
      >
        <span style={{marginRight: '10px'}} className="spinner-border spinner-border-sm text-info"></span>
        Loading...
      </button>
  } else if( !props.isValid ) {
    submitButton = 
      <button
        type="submit"
        className="btn btn-outline-secondary btn-block leaf text-uppercase"
        disabled
      >
        Sign Up Now
      </button>
  }

  if( props.submitError ) {
    submitInfo = 
      <div className="alert alert-danger alert-dismissible">
        {props.submitError}
      </div>
  } else if( props.submitError === false ) {
    submitInfo = 
      <div className="alert alert-success alert-dismissible">
        Signup successfully
      </div>
  }

  return (
    <div className="" style={{height: '100vh'}}>
      <div className="row" style={{width: '100%', height: '100%'}}>
        <div className="col-md-5" style={{
          backgroundImage: "url('https://wallpapertag.com/wallpaper/full/7/a/f/157795-download-background-tumblr-hipster-1920x1200-free-download.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}></div>
        <div className="col-md-7 flex-center">
          <form onSubmit={props.handleSignUp}>
            <div className="mb-3">
              <h3>Registration</h3>
            </div>
            <hr />
            {submitInfo}
            <h1>{props.isLoading}</h1>
            { props.showFirstNameError && props.handleAlertMessages(props.showFirstNameError, 'danger', 'First Name') }
            { props.showLastNameError && props.handleAlertMessages(props.showLastNameError, 'danger', 'Last Name') }
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
              </div>
              <input 
                type="text" 
                name="firstName" 
                className="form-control" 
                placeholder="First Name" 
                value={props.values.firstName}
                onChange={props.handleFieldChange}
              />
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-user"></i></span>
              </div>
              <input 
                type="text" 
                name="lastName"
                className="form-control" 
                placeholder="Last Name"
                value={props.values.lastName}  
                onChange={props.handleFieldChange}
              />
            </div>
            { props.showEmailError && props.handleAlertMessages(props.showEmailError, 'danger', 'Email') }
            <div className="input-group mb-3">
              <input 
                type="text" 
                name="email"
                className="form-control" 
                placeholder="Email"  
                value={props.values.email}
                onChange={props.handleFieldChange}
              />
              <div className="input-group-append">
                <span className="input-group-text"><i className="fas fa-at"></i></span>
              </div>
            </div>
            { props.showPasswordError && props.handleAlertMessages(props.showPasswordError, 'danger', 'Password') }
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text"><i className="fas fa-lock"></i></span>
              </div>
              <input 
                type="password" 
                name="password"
                className="form-control" 
                placeholder="Password" 
                value={props.values.password} 
                onChange={props.handleFieldChange}
              />
            </div>
            { props.showPolicyError && props.handleAlertMessages(props.showPolicyError, 'danger', 'Policy') }
            <div className="custom-control custom-switch text-left mb-3">
              <input 
                type="checkbox" 
                name="policy"
                className="custom-control-input" 
                id="remember"  
                checked={props.values.policy}
                onChange={props.handleFieldChange}
              />
              <label className="custom-control-label" htmlFor="remember">I have read the <a href="#Terms&Conditions">Terms and Conditions</a></label>
            </div>
            {submitButton}
            <div className="flex-between mb-3 mt-3">
              Have an account?
              
                <Link to="sign-in">Sign In <i className='fas fa-long-arrow-alt-right'></i></Link>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}