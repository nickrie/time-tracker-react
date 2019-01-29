import React, { Component } from 'react';
import firebase from 'firebase';
import { firestoreConnect } from 'react-redux-firebase';

import LoggedTime from './LoggedTime';

class Task extends Component {
  state = {
    isActive: null,
    startedDateStr: null
  };

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      isActive: task.started !== null,
      startedDateStr: this.getStartedDateStr(task.started)
    });
  }

  getStartedDateStr(started) {
    return started === null ? null : new Date(started.toDate()).toDateString();
  }

  handleRowClick() {
    const { task, firestore } = this.props;
    const isActive = !this.state.isActive;
    const started = isActive ? new Date() : null;
    const startedDateStr = isActive ? started.toDateString() : null;

    const taskUpdate = {
      started
    };

    firestore.update({ collection: 'tasks', doc: task.id }, taskUpdate);

    this.setState({ isActive, started, startedDateStr });
  }

  render() {
    const { task } = this.props;

    return (
      <div
        className={'row' + (this.state.isActive ? ' bg-primary' : '')}
        onClick={this.handleRowClick}
      >
        <div className="col col-1" />
        <div className="col col-4">{task.name}</div>
        <div className="col col-3">
          <LoggedTime minutes={task.logged} />
        </div>
        <div className="col col-2">{this.state.isActive ? 'ACTIVE' : 'NO'}</div>
        <div className="col col-2">{this.state.startedDateStr}</div>
      </div>
    );
  }
}

export default firestoreConnect()(Task);
