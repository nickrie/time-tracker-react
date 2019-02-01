import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import LoggedTime from './LoggedTime';
import LastActive from './LastActive';
import TaskButtons from './TaskButtons';

class Task extends Component {
  state = {
    // null indicates not running, a timestamp indicates when it started running
    started: null,
    // null indicates it has never run, a timestamp indicates when it last ran
    last: null,
    // # of minutes the task has been active
    activeMinutes: null,
    // current date to use for calculating last active, updated via setInterval to force the display change
    nowDate: null
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      started: task.started,
      last: task.last,
      activeMinutes: this.getActiveMinutes(),
      nowDate: new Date()
    });
    // update our Time Logged and Last Active values every 5 seconds
    this.refreshTimer = setInterval(this.updateTimeValues.bind(this), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.refreshTimer);
  }

  componentDidUpdate(prevProps) {
    // If 'started' changed, we need to re-calculate the active minutes
    if (this.props.task.started !== prevProps.task.started) {
      this.updateTimeValues();
    }
  }

  isActive() {
    const { task } = this.props;
    return task.started !== null;
  }

  getActiveMinutes() {
    const { task } = this.props;
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

  updateTimeValues() {
    this.setState({
      activeMinutes: this.getActiveMinutes(),
      nowDate: new Date()
    });
  }

  handleRowClick(e) {
    const { task } = this.props;

    // bail if they clicked the edit/delete button/icon
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

  handleEditClick(taskId) {
    this.props.editTask(taskId);
  }

  handleDeleteClick(taskId) {
    this.props.deleteTask(taskId);
  }

  render() {
    const { task } = this.props;

    // set row classes

    let rowClasses = 'row row-task border-top p-2 align-items-center';

    if (this.props.stoppedTaskId === task.id) {
      rowClasses += ' bg-danger';
    } else if (this.isActive()) {
      rowClasses += ' bg-success';
    } else if (this.props.editTaskId === task.id) {
      rowClasses += ' bg-primary text-light';
    }

    // set hover icon

    let hoverIconClasses = '';

    if (this.isActive()) {
      hoverIconClasses += 'hover-icon fas fa-stop';
    } else {
      hoverIconClasses += 'hover-icon fas fa-play';
    }

    // set action icon if we just started/stopped a task

    let actionIconClasses = '';

    if (this.props.stoppedTaskId === task.id) {
      actionIconClasses = 'fas fa-hand-paper';
    } else if (this.props.startedTaskId === task.id) {
      actionIconClasses = 'fas fa-rocket';
    }

    // set icon

    let icon = '';
    if (actionIconClasses !== '') {
      icon = <i className={actionIconClasses} />;
    } else {
      icon = <i className={hoverIconClasses} />;
    }

    // output

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
            onDeleteClick={this.handleDeleteClick}
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
  firestore: PropTypes.object.isRequired
};

export default firestoreConnect()(Task);
