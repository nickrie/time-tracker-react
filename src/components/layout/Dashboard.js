import React, { Component } from 'react';
import { firestoreConnect } from 'react-redux-firebase';

import AddTask from './../tasks/AddTask';
import EditTask from './../tasks/EditTask';
import Tasks from './../tasks/Tasks';

class Dashboard extends Component {
  state = {
    editTaskId: null
  };

  constructor(props) {
    super(props);
    this.editTask = this.editTask.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  editTask(taskId) {
    this.setState({ editTaskId: taskId });
  }

  cancelEdit() {
    this.setState({ editTaskId: null });
  }

  deleteTask(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const { firestore } = this.props;
      firestore.delete({ collection: 'tasks', doc: taskId }).then(() => {
        console.log('DELETED ' + taskId);
        this.cancelEdit();
      });
    }
  }

  render() {
    let form = '';

    if (this.state.editTaskId === null) {
      form = <AddTask />;
    } else {
      form = (
        <EditTask
          taskId={this.state.editTaskId}
          cancelEdit={this.cancelEdit}
          deleteTask={this.deleteTask}
        />
      );
    }

    return (
      <div>
        {form}
        <Tasks
          editTask={this.editTask}
          editTaskId={this.state.editTaskId}
          deleteTask={this.deleteTask}
        />
      </div>
    );
  }
}

export default firestoreConnect()(Dashboard);
