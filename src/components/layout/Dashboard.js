import React, { Component } from 'react';

import AddTask from './../tasks/AddTask';
import EditTask from './../tasks/EditTask';
import Tasks from './../tasks/Tasks';

export default class Dashboard extends Component {
  state = {
    editTaskId: null
  };

  constructor(props) {
    super(props);
    this.editTask = this.editTask.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  editTask(taskId) {
    this.setState({ editTaskId: taskId });
  }

  cancelEdit() {
    this.setState({ editTaskId: null });
  }

  render() {
    let form = '';

    if (this.state.editTaskId === null) {
      form = <AddTask />;
    } else {
      form = (
        <EditTask taskId={this.state.editTaskId} cancelEdit={this.cancelEdit} />
      );
    }

    return (
      <div>
        {form}
        <Tasks editTask={this.editTask} editTaskId={this.state.editTaskId} />
      </div>
    );
  }
}
