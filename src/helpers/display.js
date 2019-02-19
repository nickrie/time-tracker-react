import Moment from 'moment';

export function displayMinutes(minutes) {
  let mins = 0;
  let hrs = 0;

  mins = minutes % 60;

  if (minutes >= 60) {
    hrs = Math.floor(minutes / 60);
  }

  return (hrs > 0 ? hrs + 'h ' : '') + mins + 'm';
}

export function displayActiveMinutes(task) {
  let activeMinutes = 0;

  if (task.started !== null) {
    const a = Moment(new Date());
    const b = Moment(task.started);
    const seconds = a.diff(b, 'seconds');
    // we only start adding time if 5 seconds have elapsed, see task.js::stopTask()
    if (seconds >= 5) {
      activeMinutes = Math.ceil(seconds / 60);
    }
  }

  return activeMinutes;
}
