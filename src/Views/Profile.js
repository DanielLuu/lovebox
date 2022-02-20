import React, { Component } from 'react'
import { connect } from 'react-redux'
import { http } from '../Common/Http'
import * as actions from '../actions'
import { Link } from 'react-router-dom'

import RaisedButton from 'material-ui/RaisedButton'

class View extends Component {
  componentWillMount = () => {
    http.get('/api/accounts/activeuser').then((res) => {
      if (res.length > 0) {
        let user = res[0]
        this.props.receiveUser(user)
        http.post('/api/admin/events', { user_id: user.id }).then((res) => {
          console.log(res)
          this.props.receiveProfileEvents(res)
        })
      }
    })
  }

  render = () => {
    let { user, events } = this.props.login
    events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    if (!user.id) return <div></div>
    return (
      <div className='App container-fluid'>
        <h2 className='event-title'>
          {user.first_name + ' ' + user.last_name}
        </h2>
        <div className='align-left'>
          <b>Events You Manage</b>
          {events.map((event, index) => (
            <div key={index} className='event-link'>
              <Link to={'/event/' + event.code + '/admin'}>{event.name}</Link>
            </div>
          ))}
          <Link to='/create'>
            <RaisedButton
              labelColor='white'
              backgroundColor='#ff5152'
              label='create'
            />
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

export const Profile = connect(mapStateToProps, actions)(View)
