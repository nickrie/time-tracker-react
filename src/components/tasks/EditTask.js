import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import LoadingScreen from './../LoadingScreen';
import { displayMinutes, displayActiveMinutes } from './../../helpers/display';

class EditTask extends Component {
  state = {
    loadedTaskId: false,
    name: '',
    hours: 0,
    minutes: 0,
    activeMinutes: 0
  };

  constructor(props) {
    super(props);
    this.updateActiveMinutes = this.updateActiveMinutes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  // Update the activeMinutes state for the edit screen message indicating
  //  that the logged time does not include active time
  updateActiveMinutes() {
    const loadedTaskId = this.state.loadedTaskId;

    if (loadedTaskId) {
      const { task } = this.props;
      this.setState({
        activeMinutes: displayActiveMinutes(task)
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  componentDidUpdate() {
    const loadedTaskId = this.state.loadedTaskId;

    // If we're editing a new task
    if (!loadedTaskId || loadedTaskId !== this.props.taskId) {
      const { task } = this.props;
      let hours = 0;
      let minutes = 0;

      if (task.logged > 60) {
        hours = Math.floor(task.logged / 60);
        minutes = task.logged % 60;
      } else {
        minutes = task.logged;
      }

      if (this.refreshTimer) {
        clearInterval(this.refreshTimer);
      }

      // Set state with task values
      this.setState({
        loadedTaskId: this.props.taskId,
        name: task.name,
        hours: hours,
        minutes: minutes,
        activeMinutes: displayActiveMinutes(task)
      });
      // Refresh active minutes every 5 seconds
      this.refreshTimer = setInterval(
        this.updateActiveMinutes.bind(this),
        5000
      );
    }
  }

  // Input onchange handler
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // Prevent the form from submitting
  handleSubmit(e) {
    e.preventDefault();
  }

  // Cancel button handler
  handleCancelClick(e) {
    e.preventDefault();
    this.props.cancelEdit();
  }

  // Delete button handler
  handleDeleteClick() {
    this.props.deleteTask(this.props.taskId);
  }

  // Submit button handler
  handleSubmitClick(e) {
    e.preventDefault();

    const { firestore } = this.props;
    const { name } = this.state;
    let { hours, minutes } = this.state;

    // Validate the inputs
    const check = this.props.validateTaskInputs(
      this.props.taskId,
      name,
      hours,
      minutes
    );

    // If there was an error display it and prevent the update
    if (check.error) {
      alert(check.msg);
      return;
    }

    // Otherwise build the object to update firestore

    hours = hours === null || hours === '' ? 0 : parseInt(hours);
    minutes = minutes === null || minutes === '' ? 0 : parseInt(minutes);
    const logged = parseInt(hours) * 60 + parseInt(minutes);

    const taskUpdate = {
      name,
      logged
    };

    // Update firestore
    firestore.update(
      { collection: 'tasks', doc: this.props.taskId },
      taskUpdate
    );

    // Update was successful, hide the edit form
    this.props.cancelEdit();
  }

  render() {
    const { task } = this.props;

    if (task) {
      return (
        <div className="card bg-primary text-light">
          <div className="card-body">
            <form className="ml-auto my-0" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-6 col-lg-8">
                  <input
                    name="name"
                    className="form-control mr-sm-2"
                    type="text"
                    placeholder="Task Name"
                    autoComplete="off"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group col-md-3 col-lg-2">
                  <div className="input-group">
                    <input
                      name="hours"
                      className="form-control"
                      type="number"
                      min="0"
                      max="999"
                      placeholder="Hours"
                      autoComplete="off"
                      value={this.state.hours}
                      onChange={this.handleChange}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">h</div>
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-3 col-lg-2">
                  <div className="input-group">
                    <input
                      name="minutes"
                      className="form-control"
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Minutes"
                      autoComplete="off"
                      value={this.state.minutes}
                      onChange={this.handleChange}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">m</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div
                  id="edit-help"
                  className="col-md-5 col-lg-4 text-light order-md-2"
                >
                  {this.state.activeMinutes > 0
                    ? 'NOTE: This does not include the current active time of ' +
                      displayMinutes(this.state.activeMinutes) +
                      '.'
                    : ''}
                </div>
                <div className="col-md-7 col-lg-8 order-md-1">
                  <button
                    onClick={this.handleSubmitClick}
                    className="btn btn-success mr-1 my-2 my-sm-0"
                  >
                    Submit Changes
                  </button>
                  <button
                    onClick={this.handleCancelClick}
                    className="btn btn-warning mr-1 my-2 my-sm-0"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={this.handleDeleteClick}
                    className="btn btn-danger mr-1 my-2 my-sm-0"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return <LoadingScreen />;
    }
  }
}

EditTask.propTypes = {
  firestore: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    { collection: 'tasks', storeAs: 'task', doc: props.taskId }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    task: ordered.task && ordered.task[0]
  }))
)(EditTask);
