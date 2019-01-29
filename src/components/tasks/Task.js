import React, { Component } from 'react';

import LoggedTime from './LoggedTime';

export default class Task extends Component {
  state = {
    isActive: null,
    startedDateStr: null
  };

  componentDidMount() {
    const { task } = this.props;
    this.setState({
      isActive: task.started !== null,
      startedDateStr:
        task.started === null
          ? null
          : new Date(task.started.toDate()).toDateString()
    });
  }

  render() {
    const { task } = this.props;

    return (
      <div className="row">
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
