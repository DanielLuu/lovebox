import React, { Component } from 'react'
import { Card, CardText } from 'material-ui/Card'
import Popover from 'material-ui/Popover'

import { http } from '../Common/Http'

class View extends Component {
  state = {
    open: false,
  }

  handleClick = (event) => {
    event.preventDefault()

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    })
  }

  addReaction = (reaction) => {
    const { confession, updateConfession } = this.props
    http
      .post('/api/confessions/react', { confession: confession.id, reaction })
      .then((res) => {
        if (res.error) return alert(res.error)

        const currReact = confession.reactions || {}

        updateConfession(confession.id, {
          reactions: {
            ...currReact,
            [reaction]: currReact[reaction] ? currReact[reaction] + 1 : 1,
          },
        })
        this.setState({ open: false })
      })
  }

  render = () => {
    const { confession, isAdmin, delConfession } = this.props
    const { id, first_name, last_name, text, reactions } = confession
    return (
      <Card>
        <CardText>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold' }}>
              {/* <span role='img' aria-label='heart'>
                ❤️
              </span>{' '} */}
              {first_name} {last_name}
            </div>
            <div>
              <button onClick={this.handleClick} className='react-pop-btn'>
                <span role='img' aria-label='heart'>
                  ❤️
                </span>
              </button>
              <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                targetOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                onRequestClose={this.handleRequestClose}
              >
                <div className='reaction-pop'>
                  {['❤️', '😂', '😮', '😭'].map((reaction) => {
                    return (
                      <button
                        onClick={() => {
                          this.addReaction(reaction)
                        }}
                        className='react-btn'
                      >
                        {reaction}
                      </button>
                    )
                  })}
                </div>
              </Popover>
              {isAdmin && (
                <button
                  className='change-btn delete'
                  onClick={() => {
                    delConfession(id)
                  }}
                >
                  <i className='fa fa-close fa-lg' />
                </button>
              )}
            </div>
          </div>
          {text}
          {reactions && (
            <div className='reaction-bar'>
              {Object.keys(reactions).map((reaction) => {
                return (
                  <div key={reaction} className='reaction'>
                    {reaction}&nbsp;&nbsp;{reactions[reaction]}
                  </div>
                )
              })}
            </div>
          )}
        </CardText>
      </Card>
    )
  }
}

export default View
