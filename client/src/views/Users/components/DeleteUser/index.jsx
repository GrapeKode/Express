import React, { Component } from 'react'

export default class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      submitError: [],
      submitInfo: [],
      isLoading: false
    }
    
    // Binds
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
  }

  
  async handleDeleteUser(event) {
    const helperMethods = new this.props.helper()
    for( let item of this.props.list ) {
      await helperMethods.getUserByID(item).then(async doc => {
        let result = window.confirm(`You are going to delete "${doc.email}". Processing?`)
        if( result ) {
          await helperMethods.deleteUser(item)
            .then(doc => {
              if( doc.hasOwnProperty('error') ) {
                this.props.message(doc.error.message)
              } else { 
                this.props.message(doc.message, 'success')
              }
            })
        }
      })
    }
  }

  render() {
    let deleteButton = null;
    if( this.props.list.length !== 0 && Array.isArray(this.props.list) ) {
      deleteButton = 
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={this.handleDeleteUser}
      >
        <i className="fas fa-trash-alt"></i>
      </button>
    } 

    return (
      <span>
        {deleteButton}
      </span>
    )
  }
}