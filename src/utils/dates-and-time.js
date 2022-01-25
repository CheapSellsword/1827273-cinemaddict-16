import { HOUR_IN_MINS } from '../consts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);
dayjs.extend(relativeTime);

export const convertMinutes = (num) => {
  const hours = Math.floor(num / HOUR_IN_MINS);
  const minutes = num % HOUR_IN_MINS;
  return `${hours  }h ${  minutes}m`;
};

export const getHumanizedTimeOfComments = (date) => {
  const currentTime = dayjs();
  const minutesDifference = currentTime.diff(date, 'minute');
  return dayjs.duration(-minutesDifference, 'minutes').humanize(true);
};

export const getFilmLengthInMinutes = (filmLength) => {
  const filmLengthNumbers = filmLength.replace(/\D/g, '').toString();
  return Number(filmLengthNumbers.slice(1)) + Number(filmLengthNumbers.charAt(0) * 60);
};
