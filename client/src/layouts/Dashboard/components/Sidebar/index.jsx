import React, { Component } from "react"
import { Link } from "react-router-dom"

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }

  render() {
    const currentUser = { ...this.props.currentUser }
    return (
      <div className="col-lg-2 bg-light" style={{ overflowY: "auto", borderRight: "1px solid #123456", boxShadow: "22.5px 22px 5px 1px rgba(0, 0, 0, 1) !important" }}>
        <div
          className="flex-center"
          style={{
            borderBottom: "1px solid #C0C0C0",
            padding: "5px",
            backgroundColor: "#FFFFFF",
            height: "60px",
          }}
        >
          <div className="" style={{ width: "100%", display: "flex", alignItems: "center" }}>
            <img src="/icon-ri.png" width="auto" height="45" alt="Logo" />
            <h3 className="ml-2">Proiect Practica</h3>
          </div>
        </div>
        <div className="userInfo flex-center">
          <div className="text-center">
            <div
              className="userProfile"
              style={{
                backgroundColor: "#FFFFFF",
                border: "2.5px solid #20BAC9",
                boxShadow: "0 2.5px 5px 1px rgba(0, 0, 0, 0.2)",
                backgroundImage: !!this.props.currentImageURL && 'url("http://localhost:5000/image/full/' + this.props.currentImageURL + '")',
              }}
            ></div>
            <h5>
              {currentUser.firstName} {currentUser.lastName}
            </h5>
            <small>{currentUser.isAdmin ? "Admin" : "Member"}</small>
          </div>
        </div>
        <div className="options">
          <ul className="list-group-flush">
            <li className="list-group-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="list-group-item">
              <Link to="/users">Users</Link>
            </li>
            <li className="list-group-item">
              <Link to="/sign-in">Authentication</Link>
            </li>
            <li className="list-group-item">
              <Link to="/settings">Settings</Link>
            </li>
            <li className="list-group-item">
              <Link to="/account">Account</Link>
            </li>
            <li className="list-group-item">
              <Link to="/logout">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
