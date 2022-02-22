import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import { Helmet } from 'react-helmet'
import SortIcon from 'material-ui/svg-icons/content/sort'
import qs from 'qs'

import { http } from '../Common/Http'
import * as actions from '../actions'
import AdSlot from '../Common/AdSlot'
import Loading from '../Common/Loading'

import Confession from './Confession'

class View extends Component {
  state = {
    loading: false,
    creating: false,
    search: '',
  }

  columns = [
    { Header: 'First', accessor: 'first_name', width: 200 },
    { Header: 'Last', accessor: 'last_name', width: 200 },
    { Header: 'Confession', accessor: 'text' },
  ]

  fetchConfessions = () => {
    const { match, isAdmin, location } = this.props
    const event = match.params.event
    const { sort } = qs.parse(location.search.substring(1))
    const query = {}
    if (isAdmin) query.approved = false
    if (sort) query.sort = sort
    this.setState({ loading: true })
    http.get('/api/confessions/' + event, query).then((res) => {
      this.props.receiveConfessions(res)
      this.setState({ loading: false })
    })
  }

  componentWillMount = () => {
    const { match, isAdmin } = this.props
    const event = match.params.event
    if (event) {
      http.get('/api/event/' + event).then((res) => {
        this.props.receiveEvent(res)
      })
      this.fetchConfessions()

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

  componentDidUpdate = (prevProps) => {
    // if (this.props.location.search !== prevProps.location.search)
    //   this.fetchConfessions()
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

  updateConfession = (id, update) => {
    const { event, receiveConfessions } = this.props
    const { confessions } = event
    const conIndex = confessions.findIndex((con) => con.id === id)
    confessions[conIndex] = { ...confessions[conIndex], ...update }
    receiveConfessions([...confessions])
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

  handleSortChange = (event, value) => {
    this.updateQuery({ sort: value })
  }

  customFilter = (filter, row) => {
    const id = filter.pivotId || filter.id
    if (row[id] !== null && typeof row[id] === 'string') {
      return row[id] !== undefined
        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        : true
    }
  }

  updateQuery = (update) => {
    const { history, location } = this.props
    const query = qs.parse(location.search.substring(1))
    const combined = { ...query, ...update }
    Object.keys(combined).forEach(
      (key) => combined[key] === null && delete combined[key]
    )
    history.push({ search: qs.stringify({ ...combined }) })
  }

  sortStr = (a, b, field) => {
    return a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0
  }

  render = () => {
    const { event, isAdmin, location } = this.props
    const { info, form, confessions } = event
    const { creating, search, loading } = this.state
    const query = qs.parse(location.search.substring(1))

    let sortFn = ''
    switch (query.sort) {
      case 'date-asc':
        sortFn = (a, b) => new Date(a.created_at) - new Date(b.created_at)
        break
      case 'reactions-desc':
        sortFn = (a, b) => b.reaction_total - a.reaction_total
        break
      case 'first-asc':
        sortFn = (a, b) => this.sortStr(a, b, 'first_name')
        break
      case 'first-desc':
        sortFn = (a, b) => this.sortStr(b, a, 'first_name')
        break
      case 'last-asc':
        sortFn = (a, b) => this.sortStr(a, b, 'last_name')
        break
      case 'last-desc':
        sortFn = (a, b) => this.sortStr(b, a, 'last_name')
        break
      case 'date-desc':
      default:
        sortFn = (a, b) => new Date(b.created_at) - new Date(a.created_at)
        break
    }

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
      .sort(sortFn)

    return (
      <div className='App container-fluid event-container'>
        <Helmet>
          <title>{`Lovebox | ${info.name} Confessions`}</title>
        </Helmet>
        <AdSlot name='top-leaderboard' type='leaderboard_atf' />

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
          <div
            style={{
              marginBottom: 15,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <TextField
              floatingLabelText={'Search name'}
              fullWidth={true}
              value={search}
              onChange={(e) => {
                this.setState({ search: e.target.value })
              }}
            />
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <SortIcon />
                </IconButton>
              }
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onChange={this.handleSortChange}
              value={query.sort}
            >
              <MenuItem value='date-desc' primaryText='Newest' />
              <MenuItem value='date-asc' primaryText='Oldest' />
              <MenuItem value='reactions-desc' primaryText='Top Reactions' />
              <MenuItem value='first-asc' primaryText='A - Z First Name' />
              <MenuItem value='first-desc' primaryText='Z - A First Name' />
              <MenuItem value='last-asc' primaryText='A - Z Last Name' />
              <MenuItem value='last-desc' primaryText='Z - A Last Name' />
            </IconMenu>
          </div>
          {approved.length > 0 && (
            <div className='row'>
              {approved.map((confession) => {
                return (
                  <div
                    key={confession.id}
                    className='col-xs-12 col-sm-4'
                    style={{ marginBottom: 15 }}
                  >
                    <Confession
                      confession={confession}
                      isAdmin={isAdmin}
                      delConfession={this.delConfession}
                      updateConfession={this.updateConfession}
                    />
                  </div>
                )
              })}
            </div>
          )}
          {loading && <Loading />}
          <AdSlot name='bottom-leaderboard' type='leaderboard_btf' />
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
