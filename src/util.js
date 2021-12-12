// import dayjs from 'dayjs';
// import { DAYS_DIFFERENCE_LIMIT, TODAY_LIMIT, YESTERDAY_LIMIT, TIME_GAP, MIN_NUMBER, DATE_GAP } from './consts';

// export const getRandomInteger = (a = 0, b = 1) => {
//   const lower = Math.ceil(Math.min(a, b));
//   const upper = Math.floor(Math.max(a, b));
//   return Math.floor(lower + Math.random() * (upper - lower + 1));
// };

// export const getRandomPositiveFloat = (first, second, digits = 1) => {
//   const lower = Math.min(Math.abs(first), Math.abs(second));
//   const upper = Math.max(Math.abs(first), Math.abs(second));
//   const result = Math.random() * (upper - lower) + lower;
//   return result.toFixed(digits);
// };

// export const generateRandomBoolean = () => Boolean(getRandomInteger(0, 1));

// export const generateFullReleaseDate = () => {
//   const randomDate = dayjs()
//     .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year')
//     .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'month')
//     .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'day');
//   return randomDate.format('DD MMMM YYYY');
// };

// export const generateYearOnly = () => {
//   const randomDate = dayjs()
//     .subtract(getRandomInteger(MIN_NUMBER, DATE_GAP), 'year');
//   return randomDate.format('YYYY');
// };

// export const getFormattedTimeOfComment = () => {
//   const currentTime = dayjs();
//   const timeOfComment = dayjs()
//     .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'day')
//     .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'hour')
//     .subtract(getRandomInteger(MIN_NUMBER, TIME_GAP), 'minute');
//   const daysDifference = currentTime.diff(timeOfComment, 'day');

//   let formattedTimeOfComment;
//   if (daysDifference < DAYS_DIFFERENCE_LIMIT && daysDifference > YESTERDAY_LIMIT) {
//     formattedTimeOfComment = `${daysDifference  } days ago`;
//   } else if (daysDifference === YESTERDAY_LIMIT) {
//     formattedTimeOfComment = 'Yesterday';
//   } else if (daysDifference === TODAY_LIMIT) {
//     formattedTimeOfComment = 'Today';
//   } else {
//     formattedTimeOfComment = timeOfComment.format('DD/MM/YYYY HH:mm');
//   }
//   return formattedTimeOfComment;
// };

// export const getRandomItemFromArray = (array) => array[getRandomInteger(MIN_NUMBER, array.length - 1)];
// export const generateDataArray = (elementsCount, randomItem) => Array.from ({length: elementsCount}, randomItem);
