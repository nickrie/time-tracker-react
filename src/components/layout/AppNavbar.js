import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { firebaseConnect } from 'react-redux-firebase';

class AppNavbar extends Component {
  state = {
    isAuthenticated: false
  };

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;

    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }

  logout() {
    const { firebase } = this.props;
    if (window.confirm('Are you sure you want to log out?')) {
      firebase.auth().signOut();
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;

    return (
      <div className="navbar sticky-top navbar-expand-md navbar-dark bg-primary">
        <div className="container">
          <a href="#!" className="navbar-brand">
            <i className="fas fa-tasks pr-3" />
            Time Tracker v2
          </a>
          <a href="https://github.com/nickrie" className="text-light ml-2">
            <i className="fab fa-github fa-2x" />
          </a>
          {isAuthenticated ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item text-light mr-3 d-none d-md-block">
                <b>{auth.email}</b>
              </li>
              <li className="nav-item">
                <a href="#!" className="text-light" onClick={this.logout}>
                  Logout
                </a>
              </li>
            </ul>
          ) : (
            ''
          )}
          {this.props.formHidden ? (
            <div className="ml-3">
              <a href="#!" onClick={this.props.showForm} className="text-light">
                <i className="fas fa-arrow-down fa-2x" />
              </a>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}

AppNavbar.propTypes = {
  firebase: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  formHidden: PropTypes.bool,
  showForm: PropTypes.func
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth
  }))
)(AppNavbar);
