import React, { Component } from 'react'
import { connect } from 'react-redux'
import { http } from '../Common/Http'
import * as actions from '../actions'
import { Redirect } from 'react-router-dom'

import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

class View extends Component {
  componentWillMount = () => {
    http.get('/api/accounts/activeuser').then((res) => {
      if (res.length > 0) {
        let user = res[0]
        this.props.receiveUser(user)
      }
    })
    this.props.createChange('name', '')
    this.props.createChange('code', '')
  }

  handleChange = (field, event) => {
    this.props.createChange(field, event.target.value)
  }

  handleSubmit = (event) => {
    let { form } = this.props.create
    let { user } = this.props.login
    if (form.name.length > 1 && form.code.length > 0) {
      http
        .post('/api/event/create', {
          ...form,
          user_id: user.id,
        })
        .then((res) => {
          this.props.createDone(true)
        })
    } else {
      alert('Please make sure you fill out both a title and a code.')
    }
    event.preventDefault()
  }

  render = () => {
    let { form, done } = this.props.create
    console.log(done)
    return (
      <div className='App container-fluid'>
        {!done ? (
          <div>
            <h2 className='event-title'>Create an Event</h2>
            <div className='align-left'>
              <form className='confess-form' onSubmit={this.handleSubmit}>
                <TextField
                  floatingLabelText={'Title'}
                  fullWidth={true}
                  value={form.name}
                  hintText='Title of your event'
                  onChange={(event) => {
                    this.handleChange('name', event)
                  }}
                />
                <TextField
                  floatingLabelText={'Code'}
                  fullWidth={true}
                  value={form.code}
                  hintText='What you want to appear after the URL. ex. U14 for lovebox.io/U14'
                  onChange={(event) => {
                    this.handleChange('code', event)
                  }}
                />
                {/* <TextField
                  floatingLabelText={'Password'}
                  multiLine={true}
                  fullWidth={true}
                  value={form.text}
                  hintText='If you want your event to be password locked. Optional'
                  onChange={(event) => {
                    this.handleChange('confessions_pw', event)
                  }}
                /> */}
                <div className='btn-bar'>
                  <RaisedButton
                    type='submit'
                    labelColor='white'
                    backgroundColor='#ff5152'
                    fullWidth={true}
                    label='create'
                  />
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Redirect to={'/event/' + form.code} />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    create: state.create,
    login: state.login,
  }
}

export const Create = connect(mapStateToProps, actions)(View)
