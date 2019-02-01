import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserIsAuthenticated, UserIsNotAuthenticated } from './helpers/auth';
import { Provider } from 'react-redux';

// See http://docs.react-redux-firebase.com/history/v2.0.0/
import { createStore, combineReducers, compose } from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import firebase from 'firebase';
import 'firebase/firestore';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

import firebaseConfig from './secret/firebaseConfig';

import Login from './components/Login';
import Main from './components/Main';

// import { firebaseConnect } from 'react-redux-firebase';

import './App.css';

// react-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// initialize firebase instance
firebase.initializeApp(firebaseConfig); // <- new to v2.*.*

// initialize firestore
firebase.firestore(); // <- needed if using firestore

// Add reduxReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer // <- needed if using firestore
});

// Create store with reducers and initial state
const initialState = {};
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    // Enable the browser Redux devtools
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Switch>
              <Route
                exact
                path="/login"
                component={UserIsNotAuthenticated(Login)}
              />
              <Route exact path="/" component={UserIsAuthenticated(Main)} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
