import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import LoggedTime from './LoggedTime';
import LastActive from './LastActive';

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
    // If started date changed, we need to re-calculate the active minutes
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

  // stop any running tasks
  stopRunningTasks(tasks) {
    const { firestore } = this.props;
    let started, taskUpdate;

    tasks.forEach(task => {
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

  handleRowClick() {
    let started, taskUpdate;
    const { task, firestore } = this.props;

    // If this task is active, stop it
    if (this.isActive()) {
      this.stopRunningTasks(this.props.runningTasks);
    }
    // If we're starting this task stop any active task first
    else {
      this.stopRunningTasks(this.props.runningTasks);
      // start the task
      started = new Date();
      taskUpdate = {
        started
      };
      firestore.update({ collection: 'tasks', doc: task.id }, taskUpdate);
      console.log(`STARTED ${task.id}`);
    }

    this.setState({ started });
  }

  render() {
    const { task } = this.props;

    return (
      <div
        className={'row row-task' + (this.isActive() ? ' bg-success' : '')}
        onClick={this.handleRowClick}
      >
        <div className="col col-1" />
        <div className="col col-4">{task.name}</div>
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
        <div className="col col-2" />
      </div>
    );
  }
}

export default firestoreConnect()(Task);
