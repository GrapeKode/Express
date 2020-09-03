import React, { Component } from 'react'

import AuthHelperMethods from '../../components/auth/HelperMethods.jsx'
import validate from '../../components/validators/validate'

import { 
  AddUser,
  DeleteUser,
} from './components'

export default class UserListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {},
      pagination: {
        currentPage: 0,
        lastPage: 0,
        listNum: 5
      },
      selectedUser: [],
      selectedList: [],
      error: null,
      messages: {
        message: '',
        showMessage: false
      },
      isLoading: false
    }
    this.getAllUsers = this.getAllUsers.bind(this)
    this.getProfileImage = this.getProfileImage.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handleSelectUser = this.handleSelectUser.bind(this)
    this.handleSearchUser = this.handleSearchUser.bind(this)
    this.handleMessages = this.handleMessages.bind(this)
  }

  componentDidMount() {
    this.getAllUsers()
  }

  async getAllUsers() {
    const helperMethods = new AuthHelperMethods()
    this.setState({ isLoading: true })

    await helperMethods.getAllUsers(0)
      .then(async doc => {
        await Object.keys(doc).map(async key => {
          await this.setState(prev => {
            const newState = prev.users,
                  newPages = prev.pagination
            
            newPages.lastPage = key % prev.pagination.listNum === 0 ? 
              key / prev.pagination.listNum : 
              newPages.lastPage

            if( !newState.hasOwnProperty(newPages.lastPage) )
              newState[newPages.lastPage] = []
            newState[newPages.lastPage].push(doc[key])
            
            return { users: newState, pages: newPages }
          })
        })

        await this.getProfileImage(this.state.pagination.currentPage)
        return this.setState({ isLoading: false })
      })
  }

  async getProfileImage(page, index=null, id=null) {
    const helperMethods = new AuthHelperMethods()
    const users = this.state.users[page]

    if( users === undefined ) return false

    await Object.keys(users).map(async key => {
      if( users[key] === undefined ) return false
      if( users[key].hasOwnProperty('imageURL') ) return false
      if( users[key].imageID === undefined ) return false
      await helperMethods.getProfileImage(users[key].imageID)
        .then(doc => {

          this.setState(prev => {
            const newState = prev.users

            newState[page][key].imageURL = 'http://localhost:5000/image/full/' + doc.filename
            return { users: newState }
          })
        })
    })
  }

  handleFieldChange(event) {
    const { name, value } = event.target

    if( name === 'numOfItems' ) {
      this.setState(prev => {
        const newState = prev.pagination
        newState.listNum = value
        return { 
          users: {}, 
          pagination: newState, 
        }
      })
    }
    setTimeout(() => {
      this.getAllUsers()
    }, 100)
  }

  handlePagination(event) {
    if( event.target.className.match('disabled') )
      return false
    const { value } = event.target.parentElement.attributes.data

    if( value.match(/[-+]/g)  )
      this.setState(prev => {
        const newState = prev.pagination
        newState.currentPage = newState.currentPage + parseInt(value)
        if( newState.currentPage >= 0 && newState.currentPage <= newState.lastPage ) {
          this.getProfileImage(newState.currentPage)
          return { pagination: newState }
        }
      })
    else {
      this.setState(prev => {
        const newState = prev.pagination
        newState.currentPage = parseInt(value)
        this.getProfileImage(newState.currentPage)
        return { pagination: newState }
      })
    }
  }

  handleSelectUser(key, event) {
    const { users, pagination } = this.state

    if( typeof key !== 'number' && key.target.name === 'selectAll' ) {
      key = Array(Object.keys(users[pagination.currentPage]).length).fill().map((_, i) => i)
      this.setState(prev => {
        const { selectedList, pagination } = prev
        const newState = selectedList

        newState.includes(pagination.currentPage) ?
          newState.splice(newState.indexOf(pagination.currentPage), 1) :
          newState.push(pagination.currentPage)

        return { selectedUser: newState }
      })
      for(let i in key) {
        this.setState(prev => {
          const newState = prev.selectedUser
          const currentPage = prev.pagination.currentPage
          const user = prev.users[currentPage][key[i]]
          if( newState.includes(user._id) )
            newState.splice(newState.indexOf(user._id), 1)
          else 
            newState.push(user._id)
          
          return { selectedUser: newState }
        })
      }
    } else {
      if( key !== key ) return false
      this.setState(prev => {
        const newState = prev.selectedUser
        const currentPage = prev.pagination.currentPage
        const user = prev.users[currentPage][key]
        if( newState.includes(user._id) )
          newState.splice(newState.indexOf(user._id), 1)
        else 
          newState.push(user._id)
        
        return { selectedUser: newState }
      })
    }
    
  }

  handleSearchUser(event) {
    const { value } = event.target
    if( value === '' ) {
      this.setState({ users: {} })
      this.getAllUsers()
      return
    }

    const { users, pagination } = this.state
    const searchUser = {}
    let index = 0, iter = 1

    for( let i = pagination.currentPage; i <= pagination.lastPage; i++ ) {
      if( users[i] === undefined ) continue
      for( let j = 0; j < pagination.listNum; j++ ) {
        if( users[i][j] === undefined ) continue
        const email = users[i][j].email.toLowerCase(),
              firstName = users[i][j].firstName.toLowerCase(),
              lastName = users[i][j].lastName.toLowerCase()
        if( email.indexOf(value.toLowerCase()) !== -1 || firstName.indexOf(value.toLowerCase()) !== -1 || lastName.indexOf(value.toLowerCase()) !== -1 ) {
          if( !searchUser.hasOwnProperty(index) )
            searchUser[index] = []
          searchUser[index].push(users[i][j])

          if( iter === pagination.listNum ) {
            index++;
            iter = 0
          }
          iter++
        }
      }
    }
    pagination.lastPage = index
    this.setState({ users: searchUser, pagination  })
    setTimeout(() => {
      this.getProfileImage(this.state.pagination.currentPage)
    }, 300)
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
    })
    this.forceUpdate()
    setTimeout(() => {
      this.setState({ messages: { message: '', showMessage: false } })
    }, 5000);
  }

  render() {
    const { messages } = this.state

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

    const { isAdmin, email } = this.props
    const users = this.state.users
    const { currentPage, lastPage, listNum } = this.state.pagination
    
    let userList = []

    if( Object.keys(users).length === 0 ) {
      userList.push(
        <tr key="deafult_key">
          <td><i className="far fa-window-minimize"></i></td>
          <td><i className="far fa-window-minimize"></i></td>
          <td><i className="far fa-window-minimize"></i></td>
          <td><i className="far fa-window-minimize"></i></td>
        </tr>
      )
    } else if( users.hasOwnProperty(currentPage) ) {
      let accessKey = 0;
      for( let user of users[currentPage] ) {
        if( user === undefined )
          continue
        let checked = false, classes
        if( this.state.selectedUser.includes(user._id) ) {
          checked = true
          classes = 'table-active'
        } else if( user.email === email )
          classes = 'table-success'

        userList.push(
          <tr 
            key={user._id} 
            onClick={this.handleSelectUser.bind(this, accessKey)}
            className={classes}
          >
            <td style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <input type="checkbox" className="mr-3" checked={checked} readOnly />
              <img 
                alt={`Profile`}
                src={user.imageURL} 
                width='50' 
                height='50' 
                style={{
                  borderRadius: '50%',
                  marginRight: '15px'
                }} /> 
              {user.firstName} {user.lastName}
            </td>
            <td>{user.email}</td>
            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
            <td>{user.imageID}</td>
          </tr>
        )
        accessKey++
      }
    }

    // Pagination
    const pages = []
    for( let i of [...Array(lastPage + 1).keys()] ) {
      let classes = ''
      if( i === currentPage ) {
        classes = 'active'
      }
      pages.push(
        <li 
          key={i}
          className={`page-item ${classes}`} 
          data={i}
          onClick={this.handlePagination}
        >
          <a 
            className="page-link" 
            href="#"
          >{i + 1}</a>
        </li>
      )
    }
    const prevPage = currentPage === 0 && 'disabled'
    const nextPage = currentPage === lastPage && 'disabled'

    return (
      <div className="newContainer">
        { messages.showMessage && messages.message }
        <div className="text-right mb-3">
          {
            isAdmin &&
            <DeleteUser 
              helper={AuthHelperMethods} 
              validate={validate}
              list={this.state.selectedUser} 

              message={this.handleMessages}
            /> 
          }
          {
            isAdmin &&
            <AddUser 
              helper={AuthHelperMethods} 
              validate={validate}

              isAdmin={isAdmin}
            />
          }
        </div>
        <div className="flex-between mb-3">
          <div 
            className="input-group mb-3"
            style={{
              width: '40%'
            }}
          >
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search user" 
              onChange={this.handleSearchUser}
              autoFocus
            />
            <div className="input-group-append">
              <button className="btn btn-info" type="submit">Search</button>
            </div>
          </div>
          <div className="">
            View Tip
          </div>
        </div>
        <table className="table table-light table-hover">
          <thead>
            <tr>
              <th>
                <input 
                  name="selectAll"
                  type="checkbox" 
                  className="mr-3" 
                  onChange={this.handleSelectUser}
                  checked={this.state.selectedList.includes(currentPage)}
                />
                Name
              </th>
              <th>Email</th>
              <th>Admin</th>
              <th>ImageID</th>
            </tr>
          </thead>
          <tbody>
            { userList }
          </tbody>
        </table>
        <div className="flex-between">
          <select 
            name="numOfItems" 
            className="custom-select-sm float-left"
            onChange={this.handleFieldChange}
          >
            <option>Number of items {listNum} </option>
            <option value="5">5 Items</option>
            <option value="10">10 Items</option>
            <option value="25">25 Items</option>
          </select>
          <ul className="pagination justify-content-end">
            <li className={`page-item ${prevPage}`}  data='-1' onClick={this.handlePagination}><a className="page-link" href="#Prev">Previous</a></li>
            {pages}
            <li className={`page-item ${nextPage}`} data='+1' onClick={this.handlePagination}><a className="page-link" href="#Next">Next</a></li>
          </ul>
        </div>
      </div>
    )
  }
}