import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './actions'
import { Link } from 'react-router-dom'

import { getUser } from './services/users'

import lovebox from './lovebox.png'

import './App.css'
//<Link to='/login'><button className='btn'>Sign In</button></Link>
class View extends Component {
  render() {
    // let { user } = this.props.login
    const user = getUser()
    return (
      <div className='App'>
        <div className='App-header'>
          <div className='account-name'>
            {user ? (
              <Link to='/profile'>
                {user.first_name + ' ' + user.last_name}
              </Link>
            ) : (
              <div>
                <Link to='/login'>Login</Link>
              </div>
            )}
          </div>
          <Link
            to='/'
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: 25, marginRight: 10 }}>
              <img
                src={lovebox}
                alt='lovebox'
                style={{ width: '100%', verticalAlign: 'middle' }}
              />
            </div>
            <div style={{ fontSize: 20, fontWeight: 'bold' }}>lovebox</div>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
  }
}

export default connect(mapStateToProps, actions)(View)
