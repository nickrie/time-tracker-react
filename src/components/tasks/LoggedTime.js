import React from 'react';

export default function LoggedTime(props) {
  const { minutes, activeMinutes } = props;
  const totalMinutes = minutes + activeMinutes;
  let mins = 0;
  let hrs = 0;

  mins = totalMinutes % 60;

  if (totalMinutes >= 60) {
    hrs = Math.floor(totalMinutes / 60);
  }

  let timeStr = (hrs > 0 ? hrs + 'h ' : '') + mins + 'm';

  // timeStr += ` (logged: ${minutes}, active: ${activeMinutes})`;

  return <div>{timeStr}</div>;
}
