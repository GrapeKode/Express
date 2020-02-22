import React, { Component } from 'react';
// import './App.css';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history'

// Routes
import Routes from './Routes'

const browserHistory = createBrowserHistory()

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <div className='flex-center' style={{height: '100vh'}}>
//           <Route exact path="/users" component={ Users } />
//           <Route exact path="/auth/login" component={ Login } />
//           <Route exact path="/auth/register" component={ Register } />
//         </div>
//       </BrowserRouter>
//     </div>
//   );
// }

export default class App extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Routes />
      </Router>
    )
  }
}
