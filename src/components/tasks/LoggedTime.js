import React, { Component } from 'react';

export default class LoggedTime extends Component {
  render() {
    const { minutes } = this.props;
    let mins = 0;
    let hrs = 0;

    mins = minutes % 60;

    if (minutes >= 60) {
      hrs = Math.E(minutes / 60);
    }

    return (
      <div>
        {hrs > 0 ? hrs + 'h ' : ''}
        {mins}m
      </div>
    );
  }
}
