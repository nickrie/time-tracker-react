import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';

import LoggedTime from './LoggedTime';
import LastActive from './LastActive';
import TaskButtons from './TaskButtons';
import { displayActiveMinutes } from './../../helpers/display';

class Task extends Component {
  state = {
    // Null indicates not running, a timestamp indicates when it started running
    started: null,
    // Null indicates it has never run, a timestamp indicates when it last ran
    last: null,
    // # of minutes the task has been active
    activeMinutes: 0,
    // Current date to use for calculating last active, updated via setInterval to force the display change
    nowDate: null
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.updateTimeValues = this.updateTimeValues.bind(this);
  }

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      started: task.started,
      last: task.last,
      activeMinutes: displayActiveMinutes(task),
      nowDate: new Date()
    });
    // Update our Time Logged and Last Active values every 5 seconds
    this.refreshTimer = setInterval(this.updateTimeValues, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  componentDidUpdate(prevProps) {
    // If 'started' changed, we need to re-calculate the active minutes
    if (this.props.task.started !== prevProps.task.started) {
      this.updateTimeValues(this.props.task);
    }
  }

  // Returns a boolean indicating whether or not the task is currently active
  isActive() {
    const { task } = this.props;
    return task.started !== null;
  }

  // Updates state values used for calculating Time Logged and Last Active
  updateTimeValues() {
    const { task } = this.props;
    this.setState({
      activeMinutes: displayActiveMinutes(task),
      nowDate: new Date()
    });
  }

  // Row click handler
  handleRowClick(e) {
    const { task } = this.props;

    // Bail if they clicked the edit/delete button/icon
    //  those actions have their own click handlers in TaskButtons
    if (
      e.target.classList.contains('btn-edit') ||
      e.target.classList.contains('fa-pencil-alt') ||
      e.target.classList.contains('btn-delete') ||
      e.target.classList.contains('fa-trash')
    ) {
      return;
    }

    // If this task is active, stop it
    if (this.isActive()) {
      this.props.stopRunningTasks();
    } else {
      // start the task (this also stops any other running tasks)
      this.props.startTask(task);
    }
  }

  render() {
    const { task } = this.props;

    // Set row classes

    let rowClasses = 'row row-task border-top p-2 align-items-center';

    if (this.props.stoppedTaskId === task.id) {
      rowClasses += ' bg-danger';
    } else if (this.isActive()) {
      rowClasses += ' bg-success';
    } else if (this.props.editTaskId === task.id) {
      rowClasses += ' bg-primary text-light';
    }

    // Set row hover icon

    let hoverIconClasses = '';

    if (this.isActive()) {
      hoverIconClasses += 'hover-icon fas fa-stop';
    } else {
      hoverIconClasses += 'hover-icon fas fa-play';
    }

    // Set row action icon if we just started/stopped a task

    let actionIconClasses = '';

    if (this.props.stoppedTaskId === task.id) {
      actionIconClasses = 'fas fa-hand-paper';
    } else if (this.props.startedTaskId === task.id) {
      actionIconClasses = 'fas fa-rocket';
    }

    // Build icon tag

    let icon = '';
    if (actionIconClasses !== '') {
      icon = <i className={actionIconClasses} />;
    } else {
      icon = <i className={hoverIconClasses} />;
    }

    return (
      <div className={rowClasses} onClick={this.handleRowClick}>
        <div className="col col-1">{icon}</div>
        <div
          className={
            'col col-4' +
            (this.props.editTaskId === task.id ? ' bg-primary text-light' : '')
          }
        >
          {task.name}
        </div>
        <div className="col col-3 text-right">
          <LoggedTime
            minutes={task.logged}
            activeMinutes={this.state.activeMinutes}
          />
        </div>
        <div className="col col-2">
          <LastActive
            isActive={this.isActive()}
            last={task.last}
            now={this.state.nowDate}
          />
        </div>
        <div className="col col-2">
          <TaskButtons
            taskId={task.id}
            deleteTask={this.props.deleteTask}
            editTask={this.props.editTask}
            editTaskId={this.props.editTaskId}
          />
        </div>
      </div>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
  editTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  startTask: PropTypes.func.isRequired,
  stopRunningTasks: PropTypes.func.isRequired,
  editTaskId: PropTypes.string,
  startedTaskId: PropTypes.string,
  stoppedTaskId: PropTypes.string
};

export default firestoreConnect()(Task);
