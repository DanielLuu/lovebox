import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardText } from 'material-ui/Card'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import { http } from '../Common/Http'
import * as actions from '../actions'
import AdSlot from '../Common/AdSlot'

class View extends Component {
  state = {
    creating: false,
    search: '',
  }

  columns = [
    { Header: 'First', accessor: 'first_name', width: 200 },
    { Header: 'Last', accessor: 'last_name', width: 200 },
    { Header: 'Confession', accessor: 'text' },
  ]

  componentWillMount = () => {
    let event = this.props.match.params.event
    let { isAdmin } = this.props
    if (event) {
      const query = {}
      if (isAdmin) query.approved = false
      http.get('/api/event/' + event).then((res) => {
        this.props.receiveEvent(res)
      })
      http.get('/api/confessions/' + event, query).then((res) => {
        this.props.receiveConfessions(res)
      })

      if (isAdmin) {
        this.columns.push({
          Header: 'Delete',
          accessor: 'approved',
          width: 120,
          Cell: (row) => {
            return (
              <div className='change-cell'>
                <button
                  className='change-btn delete'
                  onClick={() => {
                    this.delConfession(row.original.id)
                  }}
                >
                  <i className='fa fa-close fa-lg' />
                </button>
              </div>
            )
          },
        })
      }
    }
  }

  delConfession = (id) => {
    if (window.confirm('Are you sure you want to delete this confession?')) {
      let event_code = this.props.match.params.event
      http.post('/api/confessions/del', { id, event_code }).then((res) => {
        if (!res.error) {
          this.props.receiveConfessions(res)
        }
      })
    }
  }

  handleChange = (field, event) => {
    this.props.formChange(field, event.target.value)
  }

  handleSubmit = (event) => {
    let { form } = this.props.event
    let event_code = this.props.match.params.event
    if (event_code) {
      http.post('/api/confess', { ...form, event_code }).then((res) => {
        this.props.receiveConfessions(res)
        alert('Confession submitted!')
      })
    }
    this.props.formChange('first_name', '')
    this.props.formChange('last_name', '')
    this.props.formChange('text', '')
    event.preventDefault()
  }

  customFilter = (filter, row) => {
    const id = filter.pivotId || filter.id
    if (row[id] !== null && typeof row[id] === 'string') {
      return row[id] !== undefined
        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        : true
    }
  }

  render = () => {
    const { event, isAdmin } = this.props
    const { info, form, confessions } = event
    const { creating, search } = this.state

    const approved = confessions
      .filter((confession) => {
        const { approved, first_name, last_name } = confession
        const lowerSearch = search.toLowerCase()

        return (
          approved &&
          (search
            ? first_name.toLowerCase().includes(lowerSearch) ||
              last_name.toLowerCase().includes(lowerSearch)
            : true)
        )
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    return (
      <div className='App container-fluid event-container'>
        <AdSlot name='nookazon_itm_leaderboard' />

        <h2 className='event-title'>{info.name} Confessions</h2>
        <div className='red' style={{ marginTop: 10 }}>
          NOTE: Your confession will not appear until it is approved.
        </div>
        <div className='align-left'>
          {creating ? (
            <form className='confess-form' onSubmit={this.handleSubmit}>
              <div className='row'>
                <div className='col-xs-12 col-sm-6'>
                  <TextField
                    floatingLabelText='To First Name'
                    fullWidth={true}
                    value={form.first_name}
                    onChange={(event) => {
                      this.handleChange('first_name', event)
                    }}
                  />
                </div>
                <div className='col-xs-12 col-sm-6'>
                  <TextField
                    floatingLabelText='To Last Name'
                    fullWidth={true}
                    Y
                    value={form.last_name}
                    onChange={(event) => {
                      this.handleChange('last_name', event)
                    }}
                  />
                </div>
                <div className='col-xs-12'>
                  <TextField
                    floatingLabelText={'Confession'}
                    multiLine={true}
                    rows={2}
                    fullWidth={true}
                    value={form.text}
                    onChange={(event) => {
                      this.handleChange('text', event)
                    }}
                  />
                </div>
              </div>
              <div className='btn-bar row'>
                <div className='col-xs-6'>
                  <RaisedButton
                    type='submit'
                    labelColor='white'
                    backgroundColor='#ff5152'
                    fullWidth={true}
                    label='CONFESS'
                  />
                </div>
                <div className='col-xs-6'>
                  <RaisedButton
                    fullWidth
                    secondary
                    label='CANCEL'
                    onClick={(e) => {
                      e.preventDefault()
                      this.setState({ creating: false })
                    }}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className='btn-bar'>
              <RaisedButton
                labelColor='white'
                backgroundColor='#ff5152'
                fullWidth={true}
                label='ADD YOUR CONFESSION'
                onClick={() => {
                  this.setState({ creating: true })
                }}
              />
            </div>
          )}
          <div style={{ marginBottom: 15 }}>
            <TextField
              floatingLabelText={'Search name'}
              fullWidth={true}
              value={search}
              onChange={(e) => {
                this.setState({ search: e.target.value })
              }}
            />
          </div>
          <div className='row'>
            {approved.map((confession) => {
              const { id, first_name, last_name, text } = confession
              return (
                <div
                  className='col-xs-12 col-sm-4'
                  style={{ marginBottom: 15 }}
                >
                  <Card>
                    <CardText>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ fontWeight: 'bold' }}>
                          ❤️ {first_name} {last_name}
                        </div>
                        {isAdmin && (
                          <button
                            className='change-btn delete'
                            onClick={() => {
                              this.delConfession(id)
                            }}
                          >
                            <i className='fa fa-close fa-lg' />
                          </button>
                        )}
                      </div>

                      {text}
                    </CardText>
                  </Card>
                </div>
              )
            })}
          </div>
          <AdSlot name='nookazon_itm_leaderboard_btf' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    event: state.event,
  }
}

export const Event = connect(mapStateToProps, actions)(View)
