export const GENERATED_FILMS_COUNT = 6;
export const FILMS_COUNT_PER_STEP = 5;
export const DATE_GAP = 100;
export const TIME_GAP = 10;
export const MAX_DESCRIPTION_LENGTH = 140;
export const TITLES = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];
export const POSTERS = [
  './images/posters/the-dance-of-life.jpg',
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];
export const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. ',
];
export const MIN_NUMBER = 0;
export const MAX_NUMBER = 9;
export const MIN_ITEMS_COUNT = 1;

export const MAX_DESCRIPTIONS_COUNT = 5;

export const MIN_FILM_LENGTH = 60;
export const MAX_FILM_LENGTH = 200;

export const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
  'Film-Noir',
];
export const MAX_GENRES_COUNT = 3;
export const COUNTRIES = ['US', 'Germany', 'France', 'Russia', 'England', 'Italy'];
export const AGE_RESTRICTIONS = ['0+', '12+', '16+', '18+'];
export const EMOJIS = [
  './images/emoji/smile.png',
  './images/emoji/sleeping.png',
  './images/emoji/angry.png',
  './images/emoji/puke.png',
];
export const NAMES = [
  ' Иван',
  ' Хуан Себастьян',
  ' Мария',
  ' Кристоф',
  ' Виктор',
  ' Юлия',
  ' Люпита',
  ' Вашингтон',
];
export const SURNAMES = [
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг',
];
export const MAX_NAMES_COUNT = 4;
export const PIECES_OF_COMMENTS = [
  'Interesting setting! ',
  'A good cast! ',
  'Booooooooooring. ',
  'Very very old. ',
  'Meh ',
  'Almost two hours? ',
  'Seriously? ',
];

export const EXTRA_FILMS_COUNT = 2;

export const MAX_PIECES_OF_COMMENTS = 3;
export const MAX_COMMENTS = 5;

export const TODAY_LIMIT = 0;
export const SINGLE_TIME_UNIT_LIMIT = 1;
export const A_FEW_MINUTES_LIMIT = 5;
export const MINUTE_DIFFERENCE_LIMIT = 60;
export const HOURS_DIFFERENCE_LIMIT = 6;
export const DAYS_DIFFERENCE_LIMIT = 30;
export const MONTHS_DIFFERENCE_LIMIT = 12;

export const FILM_SECTION_TYPES = [
  'All movies. Upcoming',
  'Top rated',
  'Most commented'
];

export const EMOJI_TYPES = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

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
  NOVICE: 0,
  FAN: 11,
  MOVIE_BUFF: 21,
};

export const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
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
