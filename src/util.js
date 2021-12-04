import dayjs from 'dayjs';
import { MIN_NUMBER } from './consts';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomPositiveFloat = (first, second, digits = 1) => {
  const lower = Math.min(Math.abs(first), Math.abs(second));
  const upper = Math.max(Math.abs(first), Math.abs(second));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

// Допустимы ли магические числа ниже (dateGap и timeGap)? Они же временные?
export const generateFullReleaseDate = () => {
  const dateGap = 100;
  const randomDate = dayjs()
    .subtract(getRandomInteger(0, dateGap), 'year')
    .subtract(getRandomInteger(0, dateGap), 'month')
    .subtract(getRandomInteger(0, dateGap), 'day');
  return randomDate.format('DD MMMM YYYY');
};

export const generateYearOnly = () => {
  const dateGap = 100;
  const randomDate = dayjs()
    .subtract(getRandomInteger(0, dateGap), 'year');
  return randomDate.format('YYYY');
};

export const getFormattedTimeOfComment = () => {
  const currentTime = dayjs();
  const timeGap = 10;

  const timeOfComment = dayjs()
    .subtract(getRandomInteger(0, timeGap), 'day')
    .subtract(getRandomInteger(0, timeGap), 'hour')
    .subtract(getRandomInteger(0, timeGap), 'minute');
  const daysDifference = currentTime.diff(timeOfComment, 'day');

  let formattedTimeOfComment;

  if (daysDifference < 5 && daysDifference > 1) {
    formattedTimeOfComment = `${daysDifference  } days ago`;
  } else if (daysDifference === 1) {
    formattedTimeOfComment = 'Yesterday';
  } else if (daysDifference === 0) {
    formattedTimeOfComment = 'Today';
  } else {
    formattedTimeOfComment = timeOfComment.format('DD/MM/YYYY HH:mm');
  }

  return formattedTimeOfComment;
};

export const getRandomItemFromArray = (array) => array[getRandomInteger(MIN_NUMBER, array.length - 1)];
