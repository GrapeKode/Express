import React, { Component } from 'react'

import HelperMethods from '../../components/auth/HelperMethods.jsx'
import validate from '../../components/validators/validate'

import { Dashboard as DashboardLayouts } from '../../layouts'
import AccountContainer from './AccountContainer.jsx'


export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { user } = this.props
    return (
      <DashboardLayouts
        title='Account'
        currentUserId={user._id}
        >
          <AccountContainer 
            currentUserId={user._id}
            email={user.email}
            isAdmin={user.isAdmin}

            helper={HelperMethods}
            validate={validate}
          />
      </DashboardLayouts>
    )
  }
}