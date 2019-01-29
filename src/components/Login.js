import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class Login extends Component {
  render() {
    const { firebase } = this.props;

    const uiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: () => false
      }
    };

    return (
      <div>
        LOGIN:
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }
}

export default compose(
  firebaseConnect(),
  connect((state, props) => ({}))
)(Login);
// export default withFirebase(Login);
