import React, { Component } from 'react'

export default class UpdateImage extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      image: {},
      selected: null,
      error: null,
      message: '',
      isLoading: false
    }

    // BINDS
    this.removePicture = this.removePicture.bind(this)
    this.updatePicture = this.updatePicture.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  async componentDidMount() {
    // this.setState({ image: { filename: this.props.imageURL }, isLoading: false })
  }

  async updatePicture() {
    const { helper } = this.props
    this.removePicture(true)

    const Helper = new helper()
    const formData = new FormData()

    formData.append('profile', this.state.image)

    await Helper.postImage(formData)
      .then(doc => {
        if( doc.hasOwnProperty('error') ) {
          this.handleMessages(doc.error.message)
          this.setState({
            error: true,
            isLoading: false
          })
        } else {
          this.handleMessages(doc.message, 'success')
          this.setState({
            image: doc.file,
            isLoading: false
          })
        }
      })
  }

  async removePicture(force) {
    const { helper, imageID, metadata } = this.props
    const Helper = new helper()
    if( force === true ) {
      await Helper.deleteImage(imageID)
      return false
    }

    if( metadata === 'default' ) {
      alert('This picture is set as default. You cannot delete it.')
      return false
    }

    const confirm = window.confirm('Are you sure you want to remove the image?')

    if( confirm ) {
      await Helper.deleteImage(imageID)
        .then(doc => {
          console.log(doc)
          alert('The image has been deleted successfully')
        }).catch(err => {
          console.error(err)
        })
    }
  }

  async handleFieldChange(event) {
    const file = event.target.files[0]
    this.setState({ isLoading: true })

    const fileExt = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
    let check = false

    for(let item of fileExt) {
      if( item === file.type ) {
        check = true
        this.setState({ 
          image: file,
          selected: true, 
          error: null,
          message: '',
          isLoading: false 
        })
      }
    }
    if( !check ) {
      this.handleMessages('Only images are allowed')
      this.setState({
        error: true,
        isLoading: false
      })
    }
  }

  handleFormSubmit(event) {
    const { error, selected } = this.state
    this.setState({ isLoading: true })
    if( error || !selected ) {
      event.preventDefault()
      this.setState(prev => {
        const newState = prev
        newState.error = true
        newState.isLoading = false
        this.handleMessages('Please, select an image')
        return newState
      })
      return false
    }
    this.updatePicture()
  }

  handleMessages(message, type='danger', title='') {
    const classes = `alert alert-${type} fade show`

    this.setState({
      message:  <div className={classes}>
                  <strong className="mr-1">{title}</strong> 
                  {message}
                </div>
    })
    this.forceUpdate()
    setTimeout(() => {
      this.setState({ messages: '' })
    }, 5000);
  }

  // componentDidUpdate(prev) {
  //   if( this.props.imageURL !== prev.imageURL )
  //     this.setState({ image: { filename: this.props.imageURL }, isLoading: false })
  // }

  render() {
    const {
      email, 
      firstName, 
      lastName, 
      imageID,
      imageURL,
      uploadDate, 
      metadata
    } = this.props
    const profileURL = `http://localhost:5000/image/full/${imageURL}`

    const { isLoading, error, message, selected } = this.state

    let submitButton;

    if( isLoading ) {
      submitButton =
        <button
          type="submit"
          className="btn btn-outline-info btn-block leaf text-uppercase"
          disabled
        >
          <span 
            className="spinner-border text-info mr-2"
          ></span> 
          <span>Upload Picture</span>
        </button>
    } 
    if( error || !selected ) {
      submitButton = 
        <button
          type="submit"
          className="btn btn-outline-secondary btn-block leaf text-uppercase"
          disabled
        >
          Upload Picture
        </button>
    } else {
      submitButton = 
        <button
          type="submit"
          className="btn btn-info btn-block leaf text-uppercase"
        >
          Upload Picture
        </button>
    }

    return (
      <div className="card">
        <div className="modal fade" id="updateImage">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Update Profile Picture</h3>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <div className="modal-body">
                {!!message && message}
                <form onSubmit={this.handleFormSubmit} className="text-left">
                  <img 
                    src={profileURL} 
                    alt="Profile" 
                    className="card-img-top mb-3"
                    />
                  <div className="custom-file mb-3">
                    <input 
                      type="file" 
                      className="custom-file-input" 
                      id="uploadPicture" 
                      onChange={this.handleFieldChange}
                      />
                    <label className="custom-file-label" htmlFor="uploadPicture">Choose file</label>
                  </div>
                  {submitButton}
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
              </div>

            </div>
          </div>
        </div>
        <div className="card-header text-center">
          <h3 className="card-title">{firstName} {lastName}</h3>
        </div>
        <img 
          className="card-img-top"
          src={profileURL} 
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
            data-toggle="modal" 
            data-target="#updateImage"
            >Upload Picture</button>
          <button 
            className="btn btn-outline-danger text-uppercase"
            onClick={this.removePicture}
            disabled={metadata === 'default' || imageID === null}
            >Remove Picture</button>
        </div>
      </div>
    )
  }
}