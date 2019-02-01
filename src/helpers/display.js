export function displayMinutes(minutes) {
  let mins = 0;
  let hrs = 0;

  mins = minutes % 60;

  if (minutes >= 60) {
    hrs = Math.floor(minutes / 60);
  }

  return (hrs > 0 ? hrs + 'h ' : '') + mins + 'm';
}
