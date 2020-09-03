import React, { Component } from 'react'

import Helper from '../../components/auth/HelperMethods.jsx'

import { Dashboard as DashboardLayouts } from '../../layouts'
import DashboarContainer from './DashboardContainer.jsx'


export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUserId: props.user._id,
      isLoading: false
    }
    this.getProfileImage = this.getProfileImage.bind(this)
  }

  getProfileImage(id) {
  }

  render() {
    return (
      <DashboardLayouts
        title='Dashboard'
        currentUserId={this.state.currentUserId}
      >
        <DashboarContainer 
          helper={Helper}

          isLoading={this.state.isLoading}
          isAdmin={this.props.user.isAdmin}
          email={this.props.user.email}

          numOfUser={this.state.users}
          numOfImages={this.state.images}
        />
      </DashboardLayouts>
    )
  }
}