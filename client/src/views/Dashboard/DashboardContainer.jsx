import React, { Component } from 'react'
export default class DashboardComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: 0,
      admins: 0,
      images: 0,
      isLoading: false
    }

    this.getNumOfUsers = this.getNumOfUsers.bind(this)
    this.getNumOfImages = this.getNumOfImages.bind(this)
  } 

  componentDidMount() {
    this.getNumOfUsers()
  }

  async getNumOfUsers() {
    this.setState({ isLoading: true })

    const helper = new this.props.helper()

    await helper.getAllUsers()
      .then(async doc => {
        let admin = 0;
        const user = await Object.keys(doc).map(key => {
          if( doc[key] !== undefined && doc[key].isAdmin )
            admin++;
          return parseInt(key) + 1
        })
        this.setState({ 
          users: user[user.length-1], 
          admins: admin, 
          isLoading: false 
        })
        await this.getNumOfImages()
      })
  } 

  async getNumOfImages() {
    this.setState({ isLoading: true })
    const helper = new this.props.helper()

    await helper.getAllImages(50)
      .then(async doc => {
        const image = await Object.keys(doc).map(key => parseInt(key) + 1)
        this.setState({ images: image[image.length-1], isLoading: false })
      })
  }

  render() {
    const loading = 
      <div>
        <span 
          style={{marginRight: '10px'}} 
          className="spinner-border text-info"
        ></span>
      </div>

    if( this.props.isLoading ) {
      return {loading}
    }

    return (
      <div className="newContainer">
        <div className="row">
          <div className="col-md-4 flex-center" title="Users" data-toggle="tooltip">
            <div className="text-center">
              <i className="fas fa-users fa-3x text-info"></i>
              {this.state.isLoading ? loading : <h1>{this.state.users}</h1>}
              <p>Users</p>
            </div>
          </div>
          <div className="col-md-4 flex-center" title="Admins" data-toggle="tooltip">
            <div className="text-center">
              <i className="fas fa-user-shield fa-3x text-danger"></i>
              {this.state.isLoading ? loading : <h1>{this.state.admins}</h1>}
              <p>Admins</p>
            </div>
          </div>
          <div className="col-md-4 flex-center" title="Images" data-toggle="tooltip">
            <div className="text-center">
              <i className="fas fa-images fa-3x text-success"></i>
              {this.state.isLoading ? loading : <h1>{this.state.images}</h1>}
              <p>Images</p>
            </div>
          </div>
        </div>
      </div>
    )
  }  
}