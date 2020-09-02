import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <footer 
        className="flex-center" 
        style={{
          height: '50px',
          borderTop: '1px solid #303030',

        }}
      >
        &copy; 2020 Ghetes Damaris-Ligia
      </footer>
    )
  }
}