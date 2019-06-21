import React, { Component, Fragment } from 'react'

import { Sidebar, Footer, Topbar } from './components'
import AuthHelperMethods from '../../components/auth/HelperMethods.jsx'

// Views
// import DashboardContainer from '../../views/Dashboard/DashboardContainer.jsx'
// import UsersListContainer from '../../views/Users/UsersContainer.jsx'
// import SignUpContainer from '../../views/SignUp/SighUpContainer.jsx'
// import SignInContainer from '../../views/SignIn/SignInContainer.jsx'

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    // console.log('Dashboard_layouts_props:', props)
    this.state = {
      currentUserId: props.currentUserId,
      currentUser: {},
      currentImage: {},
      isLoading: false
    }
    
    // Binds
  }

  async componentDidMount() {
    this.setState({ isLoading: true })

    const Auth = new AuthHelperMethods()
    const id = this.state.currentUserId

    await Auth.getUserByID(id).then(async doc => {
      this.setState({ currentUser: { ...doc } })
      await Auth.getProfileImage(this.state.currentUser.imageID)
        .then(doc => {
          // console.log('doc:', doc)
          this.setState({ currentImage: { ...doc } })
          // console.log('IMAGE:', this.state.currentImage)
        })
    })
    this.setState({ isLoading: false })
  }
  
  render() {
    const { title, children } = this.props
    return (
      <Fragment>
        <div className="jumbotron" style={{
          height: '100vh', 
          width: '100vw'
        }}>
          <div className="row" style={{width: '100%', height: '100%'}}>
            <Sidebar
              currentUser = {this.state.currentUser}
              currentImageURL = {this.state.currentImage.filename}

            />
            <div className="col-lg-10 bg-light">
              <Topbar 
                title={title}
              />
              <main>
                {/* {componentContainer[this.state.component]} */}
                {children}
                <Footer />
              </main>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}