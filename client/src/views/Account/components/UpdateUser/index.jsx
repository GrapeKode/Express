import React, { Component } from 'react'

export default class UpdateImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  render() {
    const {
      _id, 
      email, 
      isAdmin, 
      firstName, 
      lastName, 
      imageURL, 
      uploadDate, 
      metadata
    } = this.props

    return (
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">
            Profile 
            <small className="card-text ml-3" style={{fontSize: '14px'}}>The information can be edited</small>
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={this.handleSubmit}>
            <h6>Coming soon...</h6>
          </form>
        </div>
        <div className="card-footer">

        </div>
      </div>
    )
  }
}