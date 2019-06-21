import React, { Component } from 'react'

export default class UpdateImage extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      user: {},
      isLoading: false
    }

    // BINDS
    this.removePicture = this.removePicture.bind(this)
  }

  async removePicture() {
    const { helper, imageID } = this.props
    const Helper = new helper()
    await Helper.deleteImage(imageID)
      .then(doc => {
        console.log(doc)
      }).catch(err => {
        console.error(err)
      })
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
        <div className="card-header text-center">
          <h3 className="card-title">{firstName} {lastName}</h3>
        </div>
        <img 
          className="card-img-top"
          src={`http://localhost:5000/image/full/${imageURL}`} 
          alt='Profile'
          />
        <div className="card-body">
          <h3 className="card-text">{email}</h3>
          <small className="card-text">
            {uploadDate}
          </small>
        </div>
        <div className="card-footer flex-around">
          <button 
            className="btn btn-outline-info text-uppercase"

            >Upload Picture</button>
          <button 
            className="btn btn-outline-danger text-uppercase"
            onClick={this.removePicture}
            >Remove Picture</button>
        </div>
      </div>
    )
  }
}