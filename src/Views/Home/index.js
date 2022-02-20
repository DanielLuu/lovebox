import React, { Component } from 'react'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import { DateTime } from 'luxon'
import RaisedButton from 'material-ui/RaisedButton'

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
        <div className='home-info row'>
          <div className='col-xs-12 col-sm-6'>
            <h2>Share the love</h2>
            <div style={{ marginBottom: 15 }}>
              Lovebox is the perfect way for your event guests to send anonymous
              positive notes to each other. Receive, moderate, and share
              confesstions to createt that spark even after your event is over.
            </div>
            <div>
              <Link to='/login'>
                <RaisedButton
                  labelColor='white'
                  backgroundColor='#ff5152'
                  label='Get Started'
                />
              </Link>
            </div>
          </div>
        </div>
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
