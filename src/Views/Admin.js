import React, { Component } from 'react';
import { connect } from 'react-redux';
import { http } from '../Common/Http';
import * as actions from '../actions';
import { Redirect } from 'react-router-dom';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import 'font-awesome/css/font-awesome.css'
import './style.css'

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
    let { confessions } = this.props.event;
    let { admin, adminLoaded } = this.props.login;
    let event = this.props.match.params.event;
    let disapproved = confessions.filter(confession => !confession.approved);
    console.log(admin);
    return (
      <div className='App container-fluid'>
        {adminLoaded && <div>
          {(admin) ? <div>
            <h2>Admin</h2>
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
