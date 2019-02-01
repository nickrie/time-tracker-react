import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import AddTask from './../tasks/AddTask';
import EditTask from './../tasks/EditTask';
import Tasks from './../tasks/Tasks';

class Dashboard extends Component {
  state = {
    editTaskId: null,
    startedTaskId: null,
    stoppedTaskId: null
  };

  constructor(props) {
    super(props);
    this.editTask = this.editTask.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.startTask = this.startTask.bind(this);
    this.stopRunningTasks = this.stopRunningTasks.bind(this);
    this.validateTaskInputs = this.validateTaskInputs.bind(this);
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

  startTask(task) {
    const { firestore } = this.props;

    // Stop any running tasks first
    this.stopRunningTasks();

    const started = new Date();
    const taskUpdate = {
      started
    };
    firestore
      .update({ collection: 'tasks', doc: task.id }, taskUpdate)
      .then(() => {
        // console.log(`STARTED ${task.id}`);
        this.setState({
          startedTaskId: task.id
        });
        // clear startedTaskId after one second
        setTimeout(() => {
          this.setState({
            startedTaskId: null
          });
        }, 1000);
      });

    return false;
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
        firestore
          .update({ collection: 'tasks', doc: task.id }, taskUpdate)
          .then(() => {
            // console.log(`STOPPED ${task.id}`);
            this.setState({
              stoppedTaskId: task.id
            });
            // clear stoppedTaskId after one second
            setTimeout(() => {
              this.setState({
                stoppedTaskId: null
              });
            }, 1000);
          });
      }
    });
  }

  validateTaskInputs(id, name, hours, minutes) {
    const { tasks } = this.props;

    // Ensure name is not empty
    if (name.trim() === '') {
      return {
        error: true,
        focus: 'name',
        msg: 'NAME is required.'
      };
    }

    // Ensure another task with that name doesn't already exist
    let nameExists = false;
    tasks.forEach(task => {
      if (task.name === name && task.id !== id) {
        nameExists = true;
      }
    });
    if (nameExists === true) {
      return {
        error: true,
        focus: 'name',
        msg: 'A task already exists with that name.'
      };
    }

    // Check hours and minutes to ensure they are integer values of the expected size
    hours = hours === null || hours === '' ? 0 : parseInt(hours);
    minutes = minutes === null || minutes === '' ? 0 : parseInt(minutes);
    if (hours < 0 || minutes < 0 || isNaN(hours) || isNaN(minutes)) {
      return {
        error: true,
        focus: 'hours',
        msg: 'Hours and minutes must be positive integer values.'
      };
    }

    if (minutes >= 60) {
      return {
        error: true,
        focus: 'minutes',
        msg: 'Minutes must be under 60.'
      };
    }

    if (hours >= 1000) {
      return {
        error: true,
        focus: 'minutes',
        msg: 'Hours should not exceed 1000.'
      };
    }

    return { error: false };
  }

  render() {
    let form = '';

    if (this.state.editTaskId === null) {
      form = (
        <AddTask
          startTask={this.startTask}
          validateTaskInputs={this.validateTaskInputs}
        />
      );
    } else {
      form = (
        <EditTask
          taskId={this.state.editTaskId}
          cancelEdit={this.cancelEdit}
          deleteTask={this.deleteTask}
          validateTaskInputs={this.validateTaskInputs}
        />
      );
    }

    return (
      <div className="mt-2">
        {form}
        <Tasks
          tasks={this.props.tasks}
          editTask={this.editTask}
          editTaskId={this.state.editTaskId}
          deleteTask={this.deleteTask}
          startTask={this.startTask}
          stopRunningTasks={this.stopRunningTasks}
          startedTaskId={this.state.startedTaskId}
          stoppedTaskId={this.state.stoppedTaskId}
        />
      </div>
    );
  }
}

// export default firestoreConnect()(Dashboard);
export default compose(
  connect((state, props) => ({
    tasks: state.firestore.ordered.tasks,
    auth: state.firebase.auth
  })),
  firestoreConnect(props => [
    {
      collection: 'tasks',
      // orderBy: [['name', 'asc']],
      orderBy: [['created', 'desc']],
      where: [['uid', '==', props.auth.uid]]
    }
  ])
)(Dashboard);
