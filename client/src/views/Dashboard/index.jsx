import React, { Component } from 'react'

import Helper from '../../components/auth/HelperMethods.jsx'

import { Dashboard as DashboardLayouts } from '../../layouts'
import DashboarContainer from './DashboardContainer.jsx'


export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    // console.log('VIEWS_Dashboard_props:', props)
    this.state = {
      currentUserId: props.user._id,
      isLoading: false
    }
    
    // Binds
    this.getProfileImage = this.getProfileImage.bind(this)
  }

  getProfileImage(id) {
    // if ( typeof this.getProfileImage.counter == 'undefined' ) {
    //   this.getProfileImage.counter = 0;
    // }
    // if( this.getProfileImage.counter > 5 ) {
    //   return false
    // }
    // this.setState({ isLoading: true })

    // const Auth = new AuthHelperMethods()
    // Auth.getProfileImage(id)
    //   .then(doc => {
    //     console.log('IMAGE_DOC:', doc)
    //   })
    
    // this.getProfileImage.counter++
  }

  render() {
    // const currentUser = { ...this.state.currentUser }
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