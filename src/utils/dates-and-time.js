import { MIN_FILM_LENGTH, MAX_FILM_LENGTH, MIN_NUMBER, DATE_GAP, TIME_GAP, MINUTE_DIFFERENCE_LIMIT, A_FEW_MINUTES_LIMIT, DAYS_DIFFERENCE_LIMIT, TODAY_LIMIT, MONTHS_DIFFERENCE_LIMIT, SINGLE_TIME_UNIT_LIMIT, HOURS_DIFFERENCE_LIMIT } from '../consts';
import { getRandomInteger } from './common';
import dayjs from 'dayjs';

export const convertMinutes = (num) => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
  return `${hours  }h ${  minutes}m`;
};

export const generateFilmLength = () => {
  const filmLengthInMinutes = getRandomInteger(MIN_FILM_LENGTH, MAX_FILM_LENGTH);
  return convertMinutes(filmLengthInMinutes);
};

export const generateFullReleaseDate = () => {
  const randomDate = dayjs()
    // .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year')
    // .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'month')
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'day');
  return randomDate.format('DD MMMM YYYY');
};

export const generateYearOnly = () => {
  const randomDate = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year');
  return randomDate.format('YYYY');
};

export const getFormattedTimeOfComment = () => {
  const currentTime = dayjs();
  const timeOfComment = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'year')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'month')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'day')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'hour')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'minute');

  const minutesDifference = currentTime.diff(timeOfComment, 'minute');
  const hoursDifference = currentTime.diff(timeOfComment, 'hour');
  const daysDifference = currentTime.diff(timeOfComment, 'day');
  const monthsDifference = currentTime.diff(timeOfComment, 'month');
  const yearsDifference = currentTime.diff(timeOfComment, 'year');

  let formattedTimeOfComment;

  if (minutesDifference < MINUTE_DIFFERENCE_LIMIT && minutesDifference >= A_FEW_MINUTES_LIMIT) {
    formattedTimeOfComment = `${minutesDifference } minutes ago`;

  } else if (minutesDifference === SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${minutesDifference } minute ago`;

  } else if (minutesDifference < A_FEW_MINUTES_LIMIT && minutesDifference > SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = 'a few minutes ago';

  } else if (minutesDifference < SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = 'now';

  } else if (hoursDifference < HOURS_DIFFERENCE_LIMIT && hoursDifference > SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${hoursDifference } hours ago`;

  } else if (hoursDifference === SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${hoursDifference } hour ago`;

  } else if (daysDifference < DAYS_DIFFERENCE_LIMIT && daysDifference > SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${daysDifference  } days ago`;

  } else if (daysDifference === SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = 'Yesterday';

  } else if (daysDifference === TODAY_LIMIT && hoursDifference > HOURS_DIFFERENCE_LIMIT) {
    formattedTimeOfComment = 'Today';

  } else if (monthsDifference > SINGLE_TIME_UNIT_LIMIT && monthsDifference < MONTHS_DIFFERENCE_LIMIT) {
    formattedTimeOfComment = `${monthsDifference } months ago`;

  } else if (monthsDifference === SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${monthsDifference } month ago`;

  } else if (yearsDifference > SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${yearsDifference } years ago`;

  } else if (yearsDifference === SINGLE_TIME_UNIT_LIMIT) {
    formattedTimeOfComment = `${yearsDifference } year ago`;

  } else {
    formattedTimeOfComment = timeOfComment.format('DD/MM/YYYY HH:mm');
  }
  return formattedTimeOfComment;
};

export const getFilmLengthInMinutes = (filmLength) => {
  const lengthHours = filmLength.slice(0, filmLength.indexOf('h'));
  const lengthMinutes = filmLength.slice(filmLength.indexOf('h') + 1, filmLength.indexOf('m'));
  return Number(lengthHours) * 60 + Number(lengthMinutes);
};

export const getFilmLengthTotal = (films) => {
  const lengths = [];
  films.map((film) => lengths.push(getFilmLengthInMinutes(film.length)));
  const sumInMinutes = lengths.reduce((total, filmLength) => total + filmLength, 0);
  const totalLength = {
    hours: Math.round(sumInMinutes / 60),
    minutes: sumInMinutes % 60,
  };
  return totalLength;
};
