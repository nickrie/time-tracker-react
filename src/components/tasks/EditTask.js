import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import LoadingScreen from './../LoadingScreen';

class EditTask extends Component {
  state = {
    loadedTaskId: false,
    name: '',
    hours: 0,
    minutes: 0
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    // this.handleSubmitChanges = this.handleSubmitChanges.bind(this);
  }

  componentDidUpdate() {
    const loadedTaskId = this.state.loadedTaskId;

    if (!loadedTaskId || loadedTaskId !== this.props.taskId) {
      console.log('Loaded task to edit', this.props.taskId);
      const { task } = this.props;
      let hours = 0;
      let minutes = 0;

      if (task.logged > 60) {
        hours = Math.floor(task.logged / 60);
        minutes = task.logged % 60;
      } else {
        minutes = task.logged;
      }

      this.setState({
        loadedTaskId: this.props.taskId,
        name: task.name,
        hours: hours,
        minutes: minutes
      });
    }
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  // prevent the form from submitting
  handleSubmit(e) {
    e.preventDefault();
  }

  handleCancel(e) {
    this.props.cancelEdit();
    e.preventDefault();
  }

  /* TODO, copied from AddTask for now
  handleSubmitChanges(e) {
    const { firestore } = this.props;
    const { name } = this.state;
    let { hours, minutes } = this.state;

    // TODO: add enhanced error checking/handling
    if (name.trim() === '') {
      alert('NAME is required');
      return;
    }

    // TODO: check for dup task name

    // TODO: check hours/minutes are positive integers and minutes between 0-59

    hours = hours === null || hours === '' ? 0 : parseInt(hours);
    minutes = minutes === null || minutes === '' ? 0 : parseInt(minutes);
    const logged = parseInt(hours) * 60 + parseInt(minutes);

    const taskUpdate = {
      name,
      logged
    };

    firestore.update(
      { collection: 'tasks', doc: this.state.taskId },
      taskUpdate
    );

    this.setState({
      name: '',
      hours: 0,
      minutes: 0
    });

    e.preventDefault();
  }
  */

  render() {
    const { task } = this.props;

    if (task) {
      return (
        <div className="container card bg-primary text-light">
          <div className="card-body">
            <form className="ml-auto my-0" onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="form-group col-md-8">
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
                <div className="form-group col-md-2">
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
                <div className="form-group col-md-2">
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
                  className="col-md-4 text-light order-md-2"
                />
                <div className="col-md-8 order-md-1">
                  <button
                    onClick={this.handleSubmitChanges}
                    className="btn btn-success mr-1 my-2 my-sm-0"
                  >
                    Submit Changes
                  </button>
                  <button
                    onClick={this.handleCancel}
                    className="btn btn-warning mr-1 my-2 my-sm-0"
                  >
                    Cancel
                  </button>
                  <button className="btn btn-danger mr-1 my-2 my-sm-0">
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
