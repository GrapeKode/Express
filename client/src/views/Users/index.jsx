import React, { Component } from 'react'

// import AuthHelperMethods from '../../components/auth/AuthHelperMethods.jsx'

import { Dashboard as DashboardLayouts } from '../../layouts'
import UsersListContainer from './UserListContainer.jsx'


export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
    
    // Binds
  }

  render() {
    const { user } = this.props
    return (
      <DashboardLayouts
        title='User List'
        currentUserId={this.props.user._id}>
          <UsersListContainer 
            email={user.email}
            isAdmin={user.isAdmin}
          />
      </DashboardLayouts>
    )
  }
}