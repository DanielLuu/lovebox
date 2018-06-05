import React, { Component } from 'react';
import { connect } from 'react-redux';
import { http } from '../Common/Http';
import * as actions from '../actions';
import { Redirect } from 'react-router-dom';
import { Event } from './Event';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import 'font-awesome/css/font-awesome.css'
import './style.css'

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}

class View extends Component {
  componentWillMount = () => {
    http.get('/api/accounts/activeuser').then((res) => {
      if (res.length > 0) {
        let user = res[0];
        this.props.receiveUser(user);
        let event = this.props.match.params.event;
        if (event) {
          http.post('/api/admin/status', {
            user_id: user.id,
            event_code: event
          }).then((res) => {
            this.props.setAdmin(res.isAdmin);
            this.props.loadAdmin(true);
            http.get('/api/admins/' + event).then((res) => {
              this.props.receiveAdmins(res);
            });
          });
        }
      } else {
        this.props.loadAdmin(true);
      }
    });
  }

  changeStatus = (data, status) => {
    let event = this.props.match.params.event;
    if (event) {
      let payload = {confession_id: data, event_code: event};
      http.post('/api/confession_admin/' + status, payload).then((res) => {
        if (!res.error) {
          this.props.receiveConfessions(res);
        }
      });
    } else {
      alert('Invalid link');
    }
  }

  addAdmin = () => {
    let event_code = this.props.match.params.event;
    let { addAdmin } = this.props.event;
    http.post('/api/admin/add', {email: addAdmin, event_code}).then((res) => {
      if (!res.error) {
        this.props.receiveAdmins(res);
      } else {
        alert(res.error);
      }
    });
  }

  delAdmin = (id) => {
    let event_code = this.props.match.params.event;
    http.post('/api/admin/del', {id, event_code}).then((res) => {
      if (!res.error) {
        this.props.receiveAdmins(res);
      }
    });
  }

  columns = [
    { Header: 'First', accessor: 'first_name', width: 150 },
    { Header: 'Last', accessor: 'last_name', width: 150 },
    { Header: 'Confession', accessor: 'text' },
    {
      Header: 'Approve',
      accessor: 'approved',
      width: 120,
      Cell: row => {
        return <div className='change-cell'>
          <button className='change-btn approve' onClick={() => {
            this.changeStatus(row.original.id, 'approve');
          }}>
            <i className='fa fa-check fa-lg'/>
          </button>
          <button className='change-btn delete' onClick={() => {
            this.changeStatus(row.original.id, 'del');
          }}>
            <i className='fa fa-close fa-lg'/>
          </button>
        </div>
      }
    },
  ];

  render = () => {
    let { confessions, admins, addAdmin } = this.props.event;
    let { admin, adminLoaded } = this.props.login;
    let event = this.props.match.params.event;
    let disapproved = confessions.filter(confession => !confession.approved);
    return (
      <div className='App'>
        {adminLoaded && <div>
          {(admin) ? <div>
            <div className='container-fluid'>
              <h3>Approvals</h3>
              <ReactTable
                className='-striped'
                data={disapproved}
                columns={this.columns}
                filterable
                resizable={false}
                pageSize={disapproved.length}
                showPagination={false}
                loading={!confessions}
              />
              <div>
                <h3>Manage Admins</h3>
                <TextField
                  floatingLabelText={'User email'}
                  value={addAdmin}
                  onChange={(e) => {
                    this.props.editAddAdmin(e.target.value);
                }} />
                <RaisedButton
                  primary={true}
                  label='ADD'
                  onClick={() => {this.addAdmin()}}
                />
                <div style={styles.wrapper}>
                  {
                    admins.map((a, i) =>
                      <Chip
                        style={styles.chip}
                        onRequestDelete={() => { this.delAdmin(a.id) }}
                        key={i}
                      >
                        {a.email}
                      </Chip>
                    )
                  }
                </div>
              </div>
            </div>
            <Event {...this.props} isAdmin={admin}/>
          </div> : <Redirect to={"/event/" + event} />}
        </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    event: state.event,
    login: state.login
  };
}

export const Admin = connect(
  mapStateToProps,
  actions
)(View);
