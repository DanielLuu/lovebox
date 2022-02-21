import React, { Component } from 'react'
import { connect } from 'react-redux'
import { http } from '../Common/Http'
import * as actions from '../actions'
import { Redirect } from 'react-router-dom'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class View extends Component {
  handleChange = (type, field, event) => {
    if (type === 'signin') {
      this.props.signinChange(field, event.target.value)
    } else {
      this.props.signupChange(field, event.target.value)
    }
  }

  signup = (event) => {
    let { signup } = this.props.login
    http.post('/api/accounts/signup', signup).then((res) => {
      if (res.error) return alert(res.error)
      this.props.signin(true)
    })
    event.preventDefault()
  }

  signin = (event) => {
    let { signin } = this.props.login
    http.post('/api/accounts/login', signin).then((res) => {
      if (!res.error) {
        this.props.signin(true)
      } else {
        alert(res.error)
      }
    })
    event.preventDefault()
  }

  render = () => {
    let { signin, signup, signedIn } = this.props.login
    return (
      <div className='App container-fluid'>
        {signedIn ? (
          <Redirect to='/profile' />
        ) : (
          <div>
            <h2>Login</h2>
            <form className='confess-form' onSubmit={this.signin}>
              <TextField
                floatingLabelText={'Email'}
                type='email'
                fullWidth={true}
                value={signin.email}
                onChange={(event) => {
                  this.handleChange('signin', 'email', event)
                }}
              />
              <TextField
                floatingLabelText={'Password'}
                type='password'
                fullWidth={true}
                value={signin.password}
                onChange={(event) => {
                  this.handleChange('signin', 'password', event)
                }}
              />
              <div className='btn-bar'>
                <RaisedButton
                  labelColor='white'
                  backgroundColor='#ff5152'
                  fullWidth={true}
                  type='submit'
                  label='login'
                />
              </div>
            </form>
            <h2>Signup</h2>
            <form className='confess-form' onSubmit={this.signup}>
              <TextField
                floatingLabelText={'First Name'}
                fullWidth={true}
                value={signup.first_name}
                onChange={(event) => {
                  this.handleChange('signup', 'first_name', event)
                }}
              />
              <TextField
                floatingLabelText={'Last Name'}
                fullWidth={true}
                value={signup.last_name}
                onChange={(event) => {
                  this.handleChange('signup', 'last_name', event)
                }}
              />
              <TextField
                floatingLabelText={'Email'}
                type='email'
                fullWidth={true}
                value={signup.email}
                onChange={(event) => {
                  this.handleChange('signup', 'email', event)
                }}
              />
              <TextField
                floatingLabelText={'Password'}
                type='password'
                fullWidth={true}
                value={signup.password}
                onChange={(event) => {
                  this.handleChange('signup', 'password', event)
                }}
              />
              <div className='btn-bar'>
                <RaisedButton
                  labelColor='white'
                  backgroundColor='#ff5152'
                  fullWidth={true}
                  type='submit'
                  label='signup'
                />
              </div>
            </form>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login,
  }
}

export const Login = connect(mapStateToProps, actions)(View)
