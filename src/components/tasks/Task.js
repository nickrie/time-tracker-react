import React, { Component } from 'react';
import firebase from 'firebase';
import { firestoreConnect } from 'react-redux-firebase';

import LoggedTime from './LoggedTime';

class Task extends Component {
  state = {
    started: null
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      started: task.started
    });
  }

  isActive() {
    const { task } = this.props;
    return task.started !== null;
  }

  getTimeLoggedStr() {
    return this.isActive() ? 'ACTIVE' : 'TODO';
  }

  getStartedDateStr() {
    const { task } = this.props;
    return task.started === null
      ? null
      : new Date(task.started.toDate()).toDateString();
  }

  handleRowClick() {
    let started;
    const { task, firestore } = this.props;
    if (this.isActive()) {
      // stop the task
      started = null;
    } else {
      // start the task
      started = new Date();
    }

    const taskUpdate = {
      started
    };

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
        <div className="col col-2">{this.getTimeLoggedStr()}</div>
        <div className="col col-2">{this.getStartedDateStr()}</div>
      </div>
    );
  }
}

export default firestoreConnect()(Task);
