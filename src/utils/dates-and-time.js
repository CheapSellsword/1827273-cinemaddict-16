import dayjs from 'dayjs';

export const convertMinutes = (num) => {
  const hours = Math.floor(num / 60);
  const minutes = num % 60;
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

export const NameToDate = {
  TODAY: dayjs(),
  WEEK: dayjs().subtract(1, 'week'),
  MONTH: dayjs().subtract(1, 'month'),
  YEAR: dayjs().subtract(1, 'year'),
};
