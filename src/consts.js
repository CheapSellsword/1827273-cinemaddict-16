export const FILMS_COUNT_PER_STEP = 5;
export const MAX_DESCRIPTION_LENGTH = 140;
export const HOUR_IN_MINS = 60;
export const EXTRA_FILMS_COUNT = 2;

export const EMOJI_TYPES = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

export const STATS_PERIODS = [
  {
    name: 'All time',
    value: 'all-time',
  },
  {
    name: 'Today',
    value: 'today',
  },
  {
    name: 'Week',
    value: 'week',
  },
  {
    name: 'Month',
    value: 'month',
  },
  {
    name: 'Year',
    value: 'year',
  },
];

export const StatsPeriod = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const BAR_HEIGHT = 50;

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const Ranks = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie buff',
};

export const FilmsCountForRank = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  STATS: 'STATS',
  INIT: 'INIT',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

export const EvtKey = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
  ENTER: 'Enter',
};

export const FilterType = {
  ALL: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};

export const AUTHORIZATION = 'Basic lvldmkgldjpkvmjgmlgoigd';
export const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const SHAKE_ANIMATION_TIMEOUT = 600;
