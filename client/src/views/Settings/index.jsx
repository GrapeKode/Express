import React, { Component } from 'react'

import HelperMethods from '../../components/auth/HelperMethods.jsx'

import { Dashboard as DashboardLayouts } from '../../layouts'


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
        title='Settings'
        currentUserId={user._id}
        >
          <div className="newContainer flex-center">
            <h4>Coming soon...</h4>
          </div>
      </DashboardLayouts>
    )
  }
}