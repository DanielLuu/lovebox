import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './actions';
// import { Link } from 'react-router-dom';

import './App.css'
//<Link to='/login'><button className='btn'>Sign In</button></Link>
class View extends Component {
  render() {
    let { user } = this.props.login;
    return (
      <div className='App'>
        <div className='App-header'>
          <div className='account-name'>
            {user.id ? <div>{user.first_name + ' ' + user.last_name} </div>
            : <div></div>}
          </div>
          <h2>lovebox</h2>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    login: state.login
  };
}

export default connect(
  mapStateToProps,
  actions
)(View);
