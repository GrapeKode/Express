import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Sidebar extends Component {
  constructor(props) {
    super(props)
    // console.log('Sidebar_props:', props)
    this.state = {
      isLoading: true
    }
  }

  render() {
    const currentUser = { ...this.props.currentUser }
    return (
      <div className="col-lg-2 bg-light" style={{overflowY: 'scroll'}}>
        <div className="flex-center" style={{
          borderBottom: '1px solid #C0C0C0',
          padding: '5px',
          backgroundColor: '#FFFFFF'
        }}>
          <img src="/gk.png" width='50' height='50' alt="Logo" />
          <h3 className="ml-1" style={{ paddingTop: '8px' }}>GrapeKode</h3>
        </div>
        <div className="userInfo flex-center">
          <div className="text-center">
            <div className="userProfile"
              style={{
                backgroundColor: '#808080',
                backgroundImage: !!this.props.currentImageURL && 'url("http://localhost:5000/image/full/' + this.props.currentImageURL + '")'
              }}
            ></div>
            <h5>{currentUser.firstName} {currentUser.lastName}</h5>
            <small>{currentUser.isAdmin ? 'Admin' : 'Member'}</small>
          </div>
        </div>
        <div className="options">
          <ul className="list-group-flush">
            <li className="list-group-item"><Link to='/dashboard'>Dashboard</Link></li>
            <li className="list-group-item"><Link to='/users'>Users</Link></li>
            <li className="list-group-item"><Link to='/sign-in'>Authentication</Link></li>
            <li className="list-group-item"><Link to='/settings'>Settings</Link></li>
            <li className="list-group-item"><Link to='/account'>Account</Link></li>
            <li className="list-group-item"><Link to='/logout'>Logout</Link></li>
          </ul>
        </div>
      </div>
    )
  }
}