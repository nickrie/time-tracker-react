import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import LoadingScreen from './../LoadingScreen';
import Task from './Task';

class Tasks extends Component {
  state = {};

  render() {
    const { tasks } = this.props;

    if (!isLoaded(tasks)) {
      return <LoadingScreen />;
    } else if (!isEmpty(tasks)) {
      /*
      return (
        <div>
          tasks: {JSON.stringify(tasks)}
          {tasks.map(task => (
            <p>{task.name}</p>
          ))}
        </div>
      );
      */

      return (
        <div id="task-list" className="container mt-3 mb-5">
          <div className="row text-secondary" id="row-header">
            <div className="col col-1" />
            <div className="col col-4">
              <h5>Task Name</h5>
            </div>
            <div className="col col-3 text-right">
              <h5>
                <span className="d-none d-lg-inline">Time </span>Logged
              </h5>
            </div>
            <div className="col col-2">
              <h5>
                Last<span className="d-none d-lg-inline"> Active</span>
              </h5>
            </div>
            <div className="col col-2" />
          </div>
          {tasks.map(task => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      );
    } else {
      return <div>Your task list is empty.</div>;
    }
  }
}

Tasks.propTypes = {
  firestore: PropTypes.object.isRequired,
  tasks: PropTypes.array
};

export default compose(
  connect((state, props) => ({
    tasks: state.firestore.ordered.tasks,
    auth: state.firebase.auth
  })),
  firestoreConnect(props => [
    {
      collection: 'tasks',
      orderBy: [['name', 'asc']],
      where: [['uid', '==', props.auth.uid]]
    }
  ])
)(Tasks);
