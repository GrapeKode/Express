import React from "react"
import { Link } from "react-router-dom"

export default (props) => {
  let submitButton,
    submitInfo = ""

  if (props.isValid) {
    submitButton = (
      <button type="submit" className="btn btn-primary btn-block leaf text-uppercase">
        Sign In Now
      </button>
    )
  }
  if (props.isLoading) {
    submitButton = (
      <button type="button" className="btn btn-outline-secondary btn-block leaf text-uppercase disabled" disabled>
        <span style={{ marginRight: "10px" }} className="spinner-border spinner-border-sm text-info"></span>
        Loading...
      </button>
    )
  } else if (!props.isValid) {
    submitButton = (
      <button type="submit" className="btn btn-outline-secondary btn-block leaf text-uppercase" disabled>
        Sign In Now
      </button>
    )
  }

  if (props.submitError) {
    submitInfo = <div className="alert alert-danger alert-dismissible">{props.submitError}</div>
  } else if (props.submitError === false) {
    submitInfo = <div className="alert alert-success alert-dismissible">Logged in successfully</div>
  }

  return (
    <div className="" style={{ height: "100vh" }}>
      <div className="row" style={{ width: "100%", height: "100%" }}>
        <div
          className="col-md-5"
          style={{
            backgroundImage: "url('https://wallpapertag.com/wallpaper/full/7/a/f/157795-download-background-tumblr-hipster-1920x1200-free-download.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="col-md-7 flex-center">
          <form onSubmit={props.handleSignIn} style={{ width: "530px" }}>
            <div className="mb-3">
              <h3>Sign In</h3>
            </div>
            <hr />
            {submitInfo}

            {props.showEmailError && props.handleAlertMessages(props.showEmailError, "danger", "Email")}
            <div className="input-group mb-3">
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="Email"
                autocomplete="false"
                value={props.values.email}
                onChange={props.handleFieldChange}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fas fa-at"></i>
                </span>
              </div>
            </div>
            {props.showPasswordError && props.handleAlertMessages(props.showPasswordError, "danger", "Password")}
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
              <input
                type="password"
                autocomplete="false"
                name="password"
                className="form-control"
                placeholder="Password"
                value={props.values.password}
                onChange={props.handleFieldChange}
              />
            </div>
            {props.showPolicyError && props.handleAlertMessages(props.showPolicyError, "danger", "Policy")}
            <div className="custom-control custom-switch text-left mb-3">
              <input type="checkbox" name="remember" className="custom-control-input" id="remember" checked={props.values.remember} onChange={props.handleFieldChange} />
              <label className="custom-control-label" htmlFor="remember">
                Rememer me
              </label>
            </div>
            {submitButton}
            <div className="flex-between mb-3 mt-3">
              Don't have an account?
              <Link to="sign-up">
                Sign Up <i className="fas fa-long-arrow-alt-right"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
