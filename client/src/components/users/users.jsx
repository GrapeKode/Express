import React, { Component } from "react"
import Login from "../auth/login"

class Users extends Component {
  constructor() {
    super()
    this.state = {
      users: [],
      isLoading: false,
    }
    this.removeItem = this.removeItem.bind(this)
    this.logInForm = this.logInForm.bind(this)
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    fetch("http://localhost:5000/api/user?limit=0", { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          return this.setState({ users: { status: res.status, message: res.statusText }, isLoading: false }, () => console.log("Response_ERROR:", this.state.users))
        } else {
          return res.json()
        }
      })
      .then((users) => users && !this.state.users.length && this.setState({ users: users.users, isLoading: false }, () => console.log("Users fetched..", users)))
  }

  removeItem(id) {
    this.setState((prev) => {
      const newState = prev.users.map((user) => {
        if (user._id === id) {
          alert(`${user.firstName} ${user.lastName} has been removed from this list.`)
          return null
        }
        return user
      })
      let index = newState.indexOf(null)
      if (index > -1) newState.splice(index, 1)
      return {
        users: newState,
      }
    })
  }

  logInForm() {
    return <Login />
  }

  render() {
    setTimeout(() => {
      if (this.state.isLoading) this.setState({ isLoading: null })
    }, 5000)
    if (this.state.isLoading === null) {
      return (
        <p className="text-light">
          The server does not responde. Try <a href="http://localhost:3000">Refresh</a> the page
        </p>
      )
    }
    if (this.state.isLoading) {
      return (
        <div className="flex-center text-light">
          <span>Please, wait</span> <small style={{ marginLeft: "10px" }} className="spinner-border text-info"></small>
        </div>
      )
    }
    let user,
      login = ""
    if ("status" in this.state.users || this.state.users === [] || this.state.users.length === 0) {
      user = <li className="list-group-item">{this.state.users.message || "The list of users is empty"}</li>
      if (this.state.users.status === 401)
        login = (
          <li className="list-group-item">
            Please,{" "}
            <a href="#login" onClick={() => this.logInForm()}>
              Login
            </a>{" "}
            first
          </li>
        )
    } else {
      user = this.state.users.map((user) => {
        let admin, conn
        if (user.isAdmin) {
          admin = <span>Admin</span>
          conn = <span className="dot" style={{ backgroundColor: "#008000" }} title="Connection status"></span>
        } else {
          admin = <span>Member</span>
          conn = <span className="dot" title="Connection status"></span>
        }
        return (
          <li key={user._id} className="list-group-item text-dark flex-between">
            <img src={"http://localhost:5000/image/" + user.imageID} alt="Profile" width="50" height="50" />
            {user.firstName} {user.lastName}
            {admin}
            {conn}
            <button type="button" className="close" aria-label="Close" onClick={() => this.removeItem(user._id)}>
              <span aria-hidden="true">&times;</span>
            </button>
          </li>
        )
      })
    }
    return (
      <div className="container">
        <div className="">
          <div>
            <ul className="list-group-flush" style={{ width: "50%", margin: "auto" }}>
              <li className="list-group-item list-group-action active">
                <h1 className="text-center">All Users</h1>
              </li>
              {user}
              {login !== "" && (
                <li className="list-group-item">
                  <Login />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Users
