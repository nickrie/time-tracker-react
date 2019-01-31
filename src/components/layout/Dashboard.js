import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import AddTask from './../tasks/AddTask';
import EditTask from './../tasks/EditTask';
import Tasks from './../tasks/Tasks';

class Dashboard extends Component {
  state = {
    editTaskId: null
  };

  constructor(props) {
    super(props);
    this.editTask = this.editTask.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  editTask(taskId) {
    this.setState({ editTaskId: taskId });
  }

  cancelEdit() {
    this.setState({ editTaskId: null });
  }

  deleteTask(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const { firestore } = this.props;
      firestore.delete({ collection: 'tasks', doc: taskId }).then(() => {
        console.log('DELETED ' + taskId);
        this.cancelEdit();
      });
    }
  }

  // TODO: this doesn't mutate state or props so it can be a normal library function
  getActiveMinutes(task) {
    let activeMinutes = 0;

    if (task.started !== null) {
      const a = Moment(new Date());
      const b = Moment(task.started.toDate());
      const seconds = a.diff(b, 'seconds');
      // we only start adding time if 5 seconds have elapsed, see task.js::stopTask()
      if (seconds >= 5) {
        activeMinutes = Math.ceil(seconds / 60);
      }
    }

    return activeMinutes;
  }

  render() {
    let form = '';

    if (this.state.editTaskId === null) {
      form = <AddTask />;
    } else {
      form = (
        <EditTask
          taskId={this.state.editTaskId}
          cancelEdit={this.cancelEdit}
          deleteTask={this.deleteTask}
          getActiveMinutes={this.getActiveMinutes}
        />
      );
    }

    return (
      <div>
        {form}
        <Tasks
          editTask={this.editTask}
          editTaskId={this.state.editTaskId}
          deleteTask={this.deleteTask}
        />
      </div>
    );
  }
}

export default firestoreConnect()(Dashboard);
