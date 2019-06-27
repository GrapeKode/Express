import React from 'react'

export default class HelperMethods extends React.Component {
  constructor(props) {
    super(props)
    const hostURL = 'http://localhost:5000';
    this.state = {
      defaultOptions: {
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit',
        redirect: 'follow',
        referrer: 'no-referrer',
      },
      apiURI: {
        currentUser: hostURL + '/current-user',
        getUser: hostURL + '/api/user/',
        getLimitedUser: hostURL + '/api/user?limit=',
        getProfileImage: hostURL + '/image/',
        getLimitedImage: hostURL + '/image?limit='
      }
    }
    this.getCurrentUser = this.getCurrentUser.bind(this)
    this.fetch = this.fetch.bind(this)
  }

  isLoggedIn = () => {
    const token = this.getToken(); // Getting token from localstorage
    return !!token && !this.isTokenExpired(token)
  }

  isTokenExpired = token => {
    try {
      this.getCurrentUser(token)
      return false
    } catch ( err ) {
      return true
    }
  }

  setToken = idToken => {
    localStorage.setItem('id_token', idToken)
  }

  getToken = () => {
    return localStorage.getItem('id_token')
  }

  logout = () => {
    localStorage.removeItem('id_token')
  }

  // GET method - IMAGE || USER
  getCurrentUser = token => {
    return this.fetch(this.state.apiURI.currentUser, {
      method: 'GET',
      ...this.state.defaultOptions
    })
  }
  getAllUsers = limit => {
    return this.fetch(this.state.apiURI.getLimitedUser + limit, {
      ...this.state.defaultOptions
    })
  }
  getUserByID = id => {
    return this.fetch(this.state.apiURI.getUser + id, {
      method: 'GET',
      ...this.state.defaultOptions
    })
  }
  getProfileImage = id => {
    return this.fetch(this.state.apiURI.getProfileImage + id, {
      method: 'GET',
      ...this.state.defaultOptions
    })
  }
  getAllImages = limit => {
    return this.fetch(this.state.apiURI.getLimitedImage + limit, {
      method: 'GET',
      ...this.state.defaultOptions
    })
  }

  // DELETE method - IMAGE || USER
  deleteUser = id => {
    return this.fetch(this.state.apiURI.getUser + id, {
      method: 'DELETE',
      ...this.state.defaultOptions
    }, true)
  }
  deleteImage = id => {
    return this.fetch(this.state.apiURI.getProfileImage + id, {
      method: 'DELETE',
      ...this.state.defaultOptions
    }, true)
  }

  // POST | PUT method - IMAGE || USER
  createUser = body => {
    return this.fetch(this.state.apiURI.getUser, {
      method: 'POST',
      ...this.state.defaultOptions,
      body
    })
  }
  updateUser = body => {
    return this.fetch(this.state.apiURI.getUser, {
      method: 'POST',
      ...this.state.defaultOptions,
      body
    })
  }
  postImage = image => {
    return this.fetch(this.state.apiURI.getProfileImage, {
      method: 'POST',
      ...this.state.defaultOptions,
      body: image
    }, true)
  }

  fetch = async (url, options, noHeaders) => {
    const headers = {
      // Accept: 'application/x-www-form-urlencoded',
    }
    if( !noHeaders )
      headers['Content-Type'] = "application/x-www-form-urlencoded"
    if( this.isLoggedIn ) {
      headers['x-auth'] = this.getToken()
    }

    const res = await fetch(url, {
      headers,
      ...options
    }) // .then(this._checkStatus)
      ;
    // if( res.hasOwnProperty('user') )
    //   return res
    // console.log('RES___:', res)
    return res.ok || res.status !== 401 ? res.json() : {status: res.status, statusText: res.statusText}
  }

  _checkStatus = res => {
    if( res.ok )
      return res
    else {
      return {
        status: res.status,
        message: res.statusText,
        user: {
          _id: null,
          email: 'Anonymous',
          isAdmin: null
        }
      }
    }
  }
}