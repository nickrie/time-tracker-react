import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { firebaseConnect } from 'react-redux-firebase';

class AppNavbar extends Component {
  state = {
    isAuthenticated: false
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;

    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    const { auth, firebase } = this.props;

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
              <li className="nav-item text-light mr-3">
                <b>{auth.email}</b>
              </li>
              <li className="nav-item">
                <a
                  href="#!"
                  className="text-light"
                  onClick={() => firebase.auth().signOut()}
                >
                  Logout
                </a>
              </li>
            </ul>
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
  auth: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth
  }))
)(AppNavbar);
