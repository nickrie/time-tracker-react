import React from 'react';

import { displayMinutes } from '../../display';

export default function LoggedTime(props) {
  const { minutes, activeMinutes } = props;
  const totalMinutes = minutes + activeMinutes;

  return <div>{displayMinutes(totalMinutes)}</div>;
}
