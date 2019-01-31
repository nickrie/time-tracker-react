import React, { Component } from 'react';

import AddTask from './../tasks/AddTask';
import Tasks from './../tasks/Tasks';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <AddTask />
        <Tasks />
      </div>
    );
  }
}
