import Moment from 'moment';

export function getActiveMinutes(task) {
  let activeMinutes = 0;

  if (task.started !== null) {
    const a = Moment(new Date());
    const b = Moment(task.started.toDate());
    const seconds = a.diff(b, 'seconds');
    // we only start adding time if 5 seconds have elapsed, see task.js::stopTask()
    if (seconds >= 5) {
      activeMinutes = Math.ceil(seconds / 60);
    }
  }

  return activeMinutes;
}
