import { FilterType, StatsPeriod } from '../consts';
import { NameToDate } from './dates-and-time';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';

dayjs.extend(isBetweenPlugin);

export const filter = {
  [FilterType.ALL]: (films) => films.filter((film) => film.id),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isOnWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export const statsFilter = {
  [StatsPeriod.TODAY]: (films) => films.filter((film) => dayjs(film.watchingDate).isSame(NameToDate.TODAY, 'day')),
  [StatsPeriod.WEEK]: (films) => films.filter((film) => dayjs(film.watchingDate).isBetween(NameToDate.WEEK, NameToDate.TODAY, 'week', '[]')),
  [StatsPeriod.MONTH]: (films) => films.filter((film) => dayjs(film.watchingDate).isBetween(NameToDate.MONTH, NameToDate.TODAY, 'month', '[]')),
  [StatsPeriod.YEAR]: (films) => films.filter((film) => dayjs(film.watchingDate).isBetween(NameToDate.YEAR, NameToDate.TODAY, 'year', '[]')),
};
