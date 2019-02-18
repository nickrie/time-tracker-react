import React from 'react';
import PropTypes from 'prop-types';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import LoadingScreen from './../LoadingScreen';
import Task from './Task';

function Tasks(props) {
  const { tasks } = props;

  if (!isLoaded(tasks)) {
    // Waiting for tasks to be loaded from firestore
    return <LoadingScreen />;
  } else if (!isEmpty(tasks)) {
    // Tasks are loaded from firestore
    return (
      <div id="task-list" className="container text-left mt-3 mb-5">
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
          <Task
            key={task.id}
            task={task}
            editTask={props.editTask}
            deleteTask={props.deleteTask}
            startTask={props.startTask}
            stopRunningTasks={props.stopRunningTasks}
            editTaskId={props.editTaskId}
            startedTaskId={props.startedTaskId}
            stoppedTaskId={props.stoppedTaskId}
          />
        ))}
      </div>
    );
  } else {
    // Task list is empty
    return (
      <div className="container text-center text-secondary my-5">
        <h1 className="display-4">Your task list is empty.</h1>
        <p className="lead">Add a task above to get started!</p>
        <p className="text-success">New tasks are started automatically.</p>
        <p className="text-warning">Click a task to start/stop the timer.</p>
        <p className="text-secondary">
          Times are always rounded up to the nearest minute.
          <br />A task must be active for at least 5 seconds for time to be
          logged.
        </p>
      </div>
    );
  }
}

Tasks.propTypes = {
  firestore: PropTypes.object.isRequired,
  tasks: PropTypes.array,
  editTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  startTask: PropTypes.func.isRequired,
  stopRunningTasks: PropTypes.func.isRequired,
  editTaskId: PropTypes.string,
  startedTaskId: PropTypes.string,
  stoppedTaskId: PropTypes.string
};

export default firestoreConnect()(Tasks);
