import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Topbar extends Component {
  render() {
    const { title } = this.props
    return (
      <div className="topbar">
        <div className="">
          <h3>{title}</h3>
        </div>
        <div className="text-right">
          <Link to="/logout">Logout<i className="fas fa-sign-in-alt fa-1x"></i></Link>
        </div>
      </div>
    )
  }
}