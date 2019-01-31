import React from 'react';
import moment from 'moment';

import { displayMinutes } from './../../display';

export default function LastActive(props) {
  const { isActive, last, now } = props;
  let long = '';
  let short = '';

  if (isActive) {
    long = 'ACTIVE';
    short = 'ACTIVE';
  } else if (last !== null) {
    // get short elapsed time str
    let a = moment(now);
    let b = moment(last.toDate());
    let seconds = a.diff(b, 'seconds');
    let minutes = Math.ceil(seconds / 60);
    short = displayMinutes(minutes);
    // get long elapsed time str
    long = moment(last.toDate()).from(now);
  }

  return (
    <div>
      <span className="d-none d-lg-block">{long}</span>
      <span className="d-block d-lg-none">{short}</span>
    </div>
  );
}
