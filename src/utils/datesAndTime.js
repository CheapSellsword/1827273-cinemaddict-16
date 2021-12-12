import dayjs from 'dayjs';
import { getRandomInteger } from './common';
import { MIN_NUMBER, DATE_GAP, TIME_GAP, YESTERDAY_LIMIT, DAYS_DIFFERENCE_LIMIT, TODAY_LIMIT } from '../consts';

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

export const getFormattedTimeOfComment = () => {
  const currentTime = dayjs();
  const timeOfComment = dayjs()
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'day')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'hour')
    .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'minute');
  const daysDifference = currentTime.diff(timeOfComment, 'day');

  let formattedTimeOfComment;
  if (daysDifference < DAYS_DIFFERENCE_LIMIT && daysDifference > YESTERDAY_LIMIT) {
    formattedTimeOfComment = `${daysDifference  } days ago`;
  } else if (daysDifference === YESTERDAY_LIMIT) {
    formattedTimeOfComment = 'Yesterday';
  } else if (daysDifference === TODAY_LIMIT) {
    formattedTimeOfComment = 'Today';
  } else {
    formattedTimeOfComment = timeOfComment.format('DD/MM/YYYY HH:mm');
  }
  return formattedTimeOfComment;
};
