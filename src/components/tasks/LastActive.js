import React, { Component } from 'react';
import moment from 'moment';

export default class LastActive extends Component {
  render() {
    const { isActive, last } = this.props;
    let long = '';
    let short = '';

    if (isActive) {
      long = 'ACTIVE';
      short = 'ACTIVE';
    } else if (last !== null) {
      // get short elapsed time str
      let a = moment(new Date());
      let b = moment(last.toDate());
      let seconds = a.diff(b, 'seconds');
      let minutes = Math.ceil(seconds / 60);
      let mins = 0;
      let hrs = 0;
      mins = minutes % 60;
      if (minutes >= 60) {
        hrs = Math.floor(minutes / 60);
      }
      short = (hrs > 0 ? hrs + 'h ' : '') + mins + 'm';
      // get long elapsed time str
      long = moment(last.toDate()).from(new Date());
    }

    return (
      <div>
        <span className="d-none d-lg-block">{long}</span>
        <span className="d-block d-lg-none">{short}</span>
      </div>
    );
  }
}
