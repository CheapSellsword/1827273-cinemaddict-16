import { MIN_FILM_LENGTH, MAX_FILM_LENGTH, MIN_NUMBER, DATE_GAP, TIME_GAP, HOUR_IN_MINS} from '../consts';
import { getRandomInteger } from './common';
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

export const getFilmLengthInMinutes = () => getRandomInteger(MIN_FILM_LENGTH, MAX_FILM_LENGTH);

export const generateFilmLength = () => {
  const filmLengthInMinutes = getRandomInteger(MIN_FILM_LENGTH, MAX_FILM_LENGTH);

  const convertMinutes = (num) => {
    const hours = Math.floor(num / HOUR_IN_MINS);
    const minutes = num % HOUR_IN_MINS;
    return `${hours  }h ${  minutes}m`;
  };

  return convertMinutes(filmLengthInMinutes);
};

export const generateFullReleaseDate = () => {
  const randomDate = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year')
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'month')
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'day');
  return randomDate.format('DD MMMM YYYY');
};

export const generateYearOnly = () => {
  const randomDate = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year');
  return randomDate.format('YYYY');
};

export const getHumanizedTimeOfComment = () => {
  const currentTime = dayjs();
  const timeOfComment = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'month')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'day')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'hour')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'minute');

  const minutesDifference = currentTime.diff(timeOfComment, 'minute');

  return dayjs.duration(-minutesDifference, 'minutes').humanize(true);
};
