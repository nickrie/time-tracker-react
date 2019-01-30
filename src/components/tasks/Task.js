import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';
import Moment from 'moment';

import LoggedTime from './LoggedTime';
import LastActive from './LastActive';

class Task extends Component {
  state = {
    started: null,
    last: null
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      started: task.started,
      last: task.last
    });
  }

  isActive() {
    const { task } = this.props;
    return task.started !== null;
  }

  handleRowClick() {
    let started, taskUpdate;

    const { task, firestore } = this.props;

    if (this.isActive()) {
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
    } else {
      // start the task
      started = new Date();
      taskUpdate = {
        started
      };
    }

    firestore.update({ collection: 'tasks', doc: task.id }, taskUpdate);

    this.setState({ started });
  }

  render() {
    const { task } = this.props;

    return (
      <div
        className={'row' + (this.isActive() ? ' bg-primary' : '')}
        onClick={this.handleRowClick}
      >
        <div className="col col-1" />
        <div className="col col-4">{task.name}</div>
        <div className="col col-3">
          <LoggedTime minutes={task.logged} />
        </div>
        <div className="col col-2">
          <LastActive isActive={this.isActive()} last={task.last} />
        </div>
        <div className="col col-2" />
      </div>
    );
  }
}

export default firestoreConnect()(Task);
