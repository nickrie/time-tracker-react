import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import Moment from 'moment';

import LoadingScreen from './../LoadingScreen';
import Task from './Task';

class Tasks extends Component {
  constructor(props) {
    super(props);
    this.stopRunningTasks = this.stopRunningTasks.bind(this);
  }

  stopRunningTasks() {
    const { firestore } = this.props;
    let started, taskUpdate;

    this.props.tasks.forEach(task => {
      if (task.started !== null) {
        // stop the task
        started = null;

        // calculate new logged time
        //  don't update logged time or last date if it was active for less than 5 seconds
        const a = Moment(new Date());
        const b = Moment(task.started.toDate());
        const seconds = a.diff(b, 'seconds');
        const minutes = seconds < 5 ? 0 : Math.ceil(seconds / 60);

        if (minutes > 0) {
          const logged = parseInt(task.logged) + minutes;
          const last = new Date();
          taskUpdate = {
            started,
            last,
            logged
          };
        } else {
          taskUpdate = {
            started
          };
        }
        firestore.update({ collection: 'tasks', doc: task.id }, taskUpdate);
        console.log(`STOPPED ${task.id}`);
      }
    });
  }

  render() {
    const { tasks } = this.props;

    if (!isLoaded(tasks)) {
      return <LoadingScreen />;
    } else if (!isEmpty(tasks)) {
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
              stopRunningTasks={this.stopRunningTasks}
              editTask={this.props.editTask}
              editTaskId={this.props.editTaskId}
              deleteTask={this.props.deleteTask}
            />
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
  tasks: PropTypes.array,
  editTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired
};

export default firestoreConnect()(Tasks);
