import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import AppNavbar from './layout/AppNavbar';
import AppFooter from './layout/AppFooter';
import AddTask from './tasks/AddTask';
import EditTask from './tasks/EditTask';
import Tasks from './tasks/Tasks';

class Main extends Component {
  state = {
    formHidden: false,
    editTaskId: null,
    startedTaskId: null,
    stoppedTaskId: null
  };

  constructor(props) {
    super(props);
    this.hideForm = this.hideForm.bind(this);
    this.showForm = this.showForm.bind(this);
    this.editTask = this.editTask.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.startTask = this.startTask.bind(this);
    this.stopRunningTasks = this.stopRunningTasks.bind(this);
    this.validateTaskInputs = this.validateTaskInputs.bind(this);
  }

  // Hide the add/edit form
  hideForm() {
    this.setState({
      formHidden: true
    });
  }

  // Show the add/edit form
  showForm() {
    this.setState({
      formHidden: false
    });
  }

  // Edit a task
  editTask(taskId) {
    this.showForm();
    this.setState({ editTaskId: taskId });
  }

  // Cancel the edit form
  cancelEdit() {
    this.setState({ editTaskId: null });
  }

  // Delete a task
  deleteTask(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const { firestore } = this.props;
      firestore.delete({ collection: 'tasks', doc: taskId }).then(() => {
        this.cancelEdit();
      });
    }
  }

  // Start a task timer
  startTask(task) {
    const { firestore } = this.props;

    // Stop any running tasks first
    this.stopRunningTasks();

    // Build the update object
    const started = new Date();
    const taskUpdate = {
      started
    };

    // Update firestore
    firestore
      .update({ collection: 'tasks', doc: task.id }, taskUpdate)
      .then(() => {
        // Mark this task id as started for the action icon
        this.setState({
          startedTaskId: task.id
        });
        // Clear startedTaskId after one second
        setTimeout(() => {
          this.setState({
            startedTaskId: null
          });
        }, 1000);
      });

    return false;
  }

  // Stop all running task timers
  //  NOTE: although the app limits one running app at a time,
  //    updating a record at firestore could cause more than one
  //    to be running, so assume more than one could be running.
  stopRunningTasks() {
    const { firestore } = this.props;
    let started, taskUpdate;

    this.props.tasks.forEach(task => {
      if (task.started !== null) {
        // Stop the task
        started = null;

        // Calculate new logged time
        //  Don't update logged time or last date if it was active for less than 5 seconds
        const a = Moment(new Date());
        const b = Moment(task.started.toDate());
        const seconds = a.diff(b, 'seconds');
        const minutes = seconds < 5 ? 0 : Math.ceil(seconds / 60);

        if (minutes > 0) {
          // Time was logged, stop the task and update logged time and last started
          const logged = parseInt(task.logged) + minutes;
          const last = new Date();
          taskUpdate = {
            started,
            last,
            logged
          };
        } else {
          // No time was logged, so just stop the task
          taskUpdate = {
            started
          };
        }
        // Update firestore
        firestore
          .update({ collection: 'tasks', doc: task.id }, taskUpdate)
          .then(() => {
            // Mark this task id as stopped for the action icon
            this.setState({
              stoppedTaskId: task.id
            });
            // Clear stoppedTaskId after one second
            setTimeout(() => {
              this.setState({
                stoppedTaskId: null
              });
            }, 1000);
          });
      }
    });
  }

  // Validate task form input values
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

    // Ensure minutes value is valid
    if (minutes >= 60) {
      return {
        error: true,
        focus: 'minutes',
        msg: 'Minutes must be under 60.'
      };
    }

    // Ensure a reasonable upper limit on hours
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

    if (this.state.formHidden) {
      form = '';
    } else if (this.state.editTaskId === null) {
      form = (
        <AddTask
          startTask={this.startTask}
          hideForm={this.hideForm}
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
      <div className="main">
        <AppNavbar
          formHidden={this.state.formHidden}
          showForm={this.showForm}
        />
        <div className="container mt-2">
          {form}
          <Tasks
            tasks={this.props.tasks}
            editTask={this.editTask}
            deleteTask={this.deleteTask}
            startTask={this.startTask}
            stopRunningTasks={this.stopRunningTasks}
            editTaskId={this.state.editTaskId}
            startedTaskId={this.state.startedTaskId}
            stoppedTaskId={this.state.stoppedTaskId}
          />
        </div>
        <AppFooter />
      </div>
    );
  }
}

Main.propTypes = {
  firestore: PropTypes.object.isRequired,
  tasks: PropTypes.array
};

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
)(Main);
