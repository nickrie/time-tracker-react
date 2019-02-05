import React, { Component } from 'react';
import { withFirebase } from 'react-redux-firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import AppNavbar from './layout/AppNavbar';
import AppFooter from './layout/AppFooter';

class Login extends Component {
  render() {
    const { firebase } = this.props;

    const uiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: () => false
      }
    };

    return (
      <div className="main">
        <AppNavbar />
        <div className="text-secondary text-center">
          <h1 className="display-3 mt-2">Welcome!</h1>
          <p className="lead">Choose a login method:</p>
        </div>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
        <AppFooter />
      </div>
    );
  }
}

export default withFirebase(Login);
