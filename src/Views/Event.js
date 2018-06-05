import React, { Component } from 'react';
import { connect } from 'react-redux';
import { http } from '../Common/Http';
import * as actions from '../actions';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

class View extends Component {
  columns = [
    { Header: 'First', accessor: 'first_name', width: 200 },
    { Header: 'Last', accessor: 'last_name', width: 200 },
    { Header: 'Confession', accessor: 'text' },
  ];

  componentWillMount = () => {
    let event = this.props.match.params.event;
    let { isAdmin } = this.props;
    if (event) {
      http.get('/api/event/' + event).then((res) => {
        this.props.receiveEvent(res);
      });
      http.get('/api/confessions/' + event).then((res) => {
        this.props.receiveConfessions(res);
      });

      if (isAdmin) {
        this.columns.push({
          Header: 'Delete',
          accessor: 'approved',
          width: 120,
          Cell: row => {
            return <div className='change-cell'>
              <button className='change-btn delete' onClick={() => {
                this.delConfession(row.original.id);
              }}>
                <i className='fa fa-close fa-lg'/>
              </button>
            </div>
          }
        });
      }
    }
  }

  delConfession = (id) => {
    let event_code = this.props.match.params.event;
    http.post('/api/confessions/del', {id, event_code}).then((res) => {
      if (!res.error) {
        this.props.receiveConfessions(res);
      }
    });
  }

  handleChange = (field, event) => {
    this.props.formChange(field, event.target.value);
  }

  handleSubmit = (event) => {
    let { form } = this.props.event;
    let event_code = this.props.match.params.event;
    if (event_code) {
      http.post('/api/confess', {...form, event_code}).then((res) => {
        this.props.receiveConfessions(res);
        alert('Confession submitted!');
      });
    }
    this.props.formChange('first_name', '');
    this.props.formChange('last_name', '');
    this.props.formChange('text', '');
    event.preventDefault();
  }

  customFilter = (filter, row) => {
    const id = filter.pivotId || filter.id;
    if (row[id] !== null && typeof row[id] === 'string') {
      return (row[id] !== undefined
        ? String(row[id].toLowerCase()).includes(filter.value.toLowerCase())
        : true);
    }
  }

  render = () => {
    let { info, form, confessions } = this.props.event;
    let approved = confessions
    .filter(confession => confession.approved)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return (
      <div className='App container-fluid event-container'>
        <h2 className='event-title'>{info.name} Confessions</h2>
        <div className='align-left'>
          <div className='red'>NOTE: Your confession will not appear until it is approved.</div>
          <form className='confess-form' onSubmit={this.handleSubmit}>
            <TextField
              floatingLabelText={'First Name'}
              fullWidth={true}
              value={form.first_name}
              onChange={(event) => {
              this.handleChange('first_name', event);
            }} />
            <TextField
              floatingLabelText={'Last Name'}
              fullWidth={true}
              value={form.last_name}
              onChange={(event) => {
              this.handleChange('last_name', event);
            }} />
            <TextField
              floatingLabelText={'Confession'}
              multiLine={true}
              rows={2}
              fullWidth={true}
              value={form.text}
              onChange={(event) => {
              this.handleChange('text', event);
            }} />
            <div className='btn-bar'>
              <RaisedButton type='submit' primary={true} fullWidth={true} label='CONFESS' />
            </div>
          </form>
          <ReactTable
            className='-striped'
            data={approved}
            columns={this.columns}
            filterable
            defaultFilterMethod={this.customFilter}
            pageSize={approved.length}
            showPagination={false}
            loading={!approved}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    event: state.event
  };
}

export const Event = connect(
  mapStateToProps,
  actions
)(View);
