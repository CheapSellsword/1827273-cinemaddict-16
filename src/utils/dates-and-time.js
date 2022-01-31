import dayjs from 'dayjs';
import { HOUR_IN_MINS } from '../consts';

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
  const lengthHours = filmLength.slice(0, filmLength.indexOf('h'));
  const lengthMinutes = filmLength.slice(filmLength.indexOf('h') + 1, filmLength.indexOf('m'));
  return Number(lengthHours) * HOUR_IN_MINS + Number(lengthMinutes);
};

export const getFilmLengthTotal = (films) => {
  const lengths = [];
  films.map((film) => lengths.push(getFilmLengthInMinutes(film.length)));
  const sumInMinutes = lengths.reduce((total, filmLength) => total + filmLength, 0);
  const totalLength = {
    hours: Math.round(sumInMinutes / HOUR_IN_MINS),
    minutes: sumInMinutes % HOUR_IN_MINS,
  };
  return totalLength;
};

export const NameToDate = {
  TODAY: dayjs(),
  WEEK: dayjs().subtract(1, 'week'),
  MONTH: dayjs().subtract(1, 'month'),
  YEAR: dayjs().subtract(1, 'year'),
};
