import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'

import { http } from '../../Common/Http'

import './style.css'

class Home extends Component {
  state = { events: [] }

  componentDidMount = () => {
    http.get('/api/events').then((res) => {
      this.setState({ events: res.events })
    })
  }

  render() {
    const { events } = this.state

    return (
      <div className='container-fluid'>
        <div className='row'>
          {events.map((event) => {
            return (
              <div key={event.id} className='col-xs-12 col-sm-3 home-event'>
                <Link
                  to={`/event/${event.code}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Card>
                    <CardTitle
                      title={
                        <div style={{ color: '#ff5152', fontWeight: 'bold' }}>
                          {event.name}
                        </div>
                      }
                    />
                    <CardText>
                      {DateTime.fromISO(event.created_at, { zone: 'UTC' })
                        .toLocal()
                        .toFormat('MMMM dd, yyyy')}
                    </CardText>
                  </Card>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Home
