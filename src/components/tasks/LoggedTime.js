import React from 'react';
import PropTypes from 'prop-types';

import { displayMinutes } from './../../helpers/display';

function LoggedTime(props) {
  const { minutes, activeMinutes } = props;
  const totalMinutes = minutes + activeMinutes;

  return <div>{displayMinutes(totalMinutes)}</div>;
}

LoggedTime.propTypes = {
  minutes: PropTypes.number.isRequired,
  activeMinutes: PropTypes.number.isRequired
};

export default LoggedTime;
