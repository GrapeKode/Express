import React, { Component } from 'react'
import {
  UpdateImage,
  UpdateUser
} from './components'

export default class AccountContainer extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      user: {},
      messages: {
        message: '',
        showMessage: false
      },
      isLoading: false
    }

    this.getUserInfo = this.getUserInfo.bind(this)
    this.handleMessages = this.handleMessages.bind(this)
  }

  componentDidMount() {
    this.getUserInfo()
  }

  async getUserInfo() {
    const { currentUserId, helper } = this.props
    const Helper = new helper()

    await Helper.getUserByID(currentUserId)
      .then(async doc => {
        this.setState({ user: doc })
        await Helper.getProfileImage(doc.imageID)
          .then(doc => {
            this.setState(prev => {
              const newState = prev.user

              newState['imageURL'] = doc.filename
              newState['uploadDate'] = doc.uploadDate
              newState['metadata'] = doc.metadata

              return { user: newState }
            })
          })
      })
  }

  handleMessages(message, type='danger', title='') {
    const classes = `alert alert-${type} fade show`

    this.setState(prev => {
      const newState = prev.messages;
      newState.message =
        <div className={classes}>
          <strong className="mr-1">{title}</strong> 
          {message}
        </div>
      newState.showMessage = true
      return { messages: newState }
    })
    this.forceUpdate()
    setTimeout(() => {
      this.setState({ messages: { message: [], showMessage: false } })
    }, 5000);
  }

  render() {
    const { user, messages } = this.state    

    if( this.state.isLoading ) {
      return (
        <div className="flex-center" style={{height: '100vh'}}>
          <span 
            style={{marginRight: '10px'}} 
            className="spinner-border text-info"
          ></span>
        </div>
      )
    }

    return (
      <div className="newContainer">
        {
          messages.showMessage &&
          <div className="text-center mb-5">
            {messages.message}
          </div>
        }
        <div className="row flex-around">
          <div className="col-md-4">
            <UpdateImage
              _id = {user._id}
              email = {user.email}
              isAdmin = {user.isAdmin}
              firstName = {user.firstName}
              lastName = {user.lastName}
              imageID = {user.imageID}
              imageURL = {user.imageURL}
              uploadDate = {user.uploadDate}
              metadata = {user.metadata}

              helper = {this.props.helper}
              handleMessages = {this.handleMessages}
            />
          </div>
          <div className="col-md-6">
            <UpdateUser
              _id = {user._id}
              email = {user.email}
              isAdmin = {user.isAdmin}
              firstName = {user.firstName}
              lastName = {user.lastName}
              imageID = {user.imageID}
              imageURL = {user.imageURL}
              uploadDate = {user.uploadDate}
              metadata = {user.metadata}
              
              helper = {this.props.helper}
              validate = {this.props.validate}
              handleMessages = {this.handleMessages}
            />
          </div>
        </div>
      </div>
    )
  }
}