import React from 'react';

import { displayMinutes } from './../../helpers/display';

export default function LoggedTime(props) {
  const { minutes, activeMinutes } = props;
  const totalMinutes = minutes + activeMinutes;

  return <div>{displayMinutes(totalMinutes)}</div>;
}
