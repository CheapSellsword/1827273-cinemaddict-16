import { MIN_ITEMS_COUNT, MIN_NUMBER, MAX_NUMBER, TITLES, POSTERS, DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT, MAX_FILM_HOURS, MAX_FILM_MINUTES, GENRES, MAX_GENRES_COUNT, COUNTRIES, AGE_RESTRICTIONS, EMOJIS, NAMES, SURNAMES, MAX_NAMES_COUNT, PIECES_OF_COMMENTS, MAX_PIECES_OF_COMMENTS, MAX_COMMENTS } from '../consts';
import { getRandomInteger, getFormattedTimeOfComment, generateFullReleaseDate, generateYearOnly } from '../util';

// Информация о фильме

// Функции такого вида (где ты используешь такую конструкцию [getRandomInteger(MIN_NUMBER, TITLES.length - 1)]),
// можно заменить на одну функцию.
// Она будет похожа на функцию getRandomInteger
// Данная функция будет принимать любой массив и возвращать случайный элемент массива.
// И ту конструкцию, которую ты используешь, будет написана 1 раз вместо 8.Плюс будет меньше магических чисел.

const getRandomItemFromArray = (array) => array[getRandomInteger(MIN_NUMBER, array.length - 1)];

const generateTitle = () => getRandomItemFromArray(TITLES);

const generatePoster = () => getRandomItemFromArray(POSTERS);

const generateDescription = () => {
  const randomDescriptionsCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_DESCRIPTIONS_COUNT);
  let fullDescription = '';
  for (let i = MIN_ITEMS_COUNT; i <= randomDescriptionsCount; i++) {
    const randomDescriptionIndex = getRandomInteger(MIN_NUMBER, DESCRIPTIONS.length - 1);
    fullDescription += DESCRIPTIONS[randomDescriptionIndex];
  }
  return fullDescription;
};

const generateRating = () => `${getRandomInteger(MIN_NUMBER, MAX_NUMBER)  }.${  getRandomInteger(MIN_NUMBER, MAX_NUMBER)}`;

const generateLength = () => `${getRandomInteger(MIN_NUMBER, MAX_FILM_HOURS)  }h ${  getRandomInteger(MIN_NUMBER, MAX_FILM_MINUTES)  }m`;

// Много кода для функции, которая должна возвращать массив жанров различной длины.
// Функция возвращающая рандомный жанр у тебя есть.
// Подумай как реализовать функцию, которая будет принимать 2 параметра.

// Случайное число - это будет длина массива с жанрами
// Функция возвращающая рандомный элемент массива (жанр, имя, любое значение)
// и будет возвращать массив с рандомными элементами.

// Ты делал похожее с карточками фильмов.
const generateGenre = () => getRandomItemFromArray(GENRES);

const generateGenres = () => {
  const randomGenresCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_GENRES_COUNT);
  const genresArray = [];
  for (let i = MIN_NUMBER; i < randomGenresCount; i++) {
    const newGenre = generateGenre();
    genresArray.push(newGenre);
  }
  return genresArray;
};

const generateCountry = () => getRandomItemFromArray(COUNTRIES);

const generateAgeRestriction = () => getRandomItemFromArray(AGE_RESTRICTIONS);


// Комментарии и имена

const generateEmoji = () => getRandomItemFromArray(EMOJIS);

const generateName = () => {
  const fullName = `${getRandomItemFromArray(NAMES)  } ${  getRandomItemFromArray(SURNAMES)}`;
  return fullName;
};

// Подумай как реализовать функцию, которая будет принимать 2 параметра.

// Случайное число - это будет длина массива с жанрами
// Функция возвращающая рандомный элемент массива (жанр, имя, любое значение)
// и будет возвращать массив с рандомными элементами.

// Ты делал похожее с карточками фильмов.
const generateNames = () => {
  const randomNamesCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_NAMES_COUNT);
  const fullNames = [];
  for (let i = MIN_NUMBER; i < randomNamesCount; i++) {
    const newName = generateName();
    fullNames.push(newName);
  }
  return fullNames;
};

const generateCommentText = () => {
  const randomCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_PIECES_OF_COMMENTS);
  let fullComment = '';
  for (let i = MIN_ITEMS_COUNT; i <= randomCount; i++) {
    const randomPieceOfCommentIndex = getRandomInteger(MIN_NUMBER, PIECES_OF_COMMENTS.length - 1);
    fullComment += PIECES_OF_COMMENTS[randomPieceOfCommentIndex];
  }
  return fullComment;
};

const generateComment = () => (
  {
    emoji: generateEmoji(),
    author: generateName(),
    text: generateCommentText(),
    date: getFormattedTimeOfComment(),
  }
);


// Подумай как реализовать функцию, которая будет принимать 2 параметра.

// Случайное число - это будет длина массива с жанрами
// Функция возвращающая рандомный элемент массива (жанр, имя, любое значение)
// и будет возвращать массив с рандомными элементами.

// Ты делал похожее с карточками фильмов.
const generateComments = () => {
  const randomCommentsCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_COMMENTS);
  const filmComments = [];
  for (let i = MIN_NUMBER; i < randomCommentsCount; i++) {
    const newComment = generateComment();
    filmComments.push(newComment);
  }
  return filmComments;
};

// Экспорт
const generateRandomBoolean = () => Boolean(getRandomInteger(0, 1));

export const generateFilm = () => (
  {
    title: generateTitle(),
    poster: generatePoster(),
    description: generateDescription(),
    fullReleaseDate: generateFullReleaseDate(),
    releaseYear: generateYearOnly(),
    rating: generateRating(),
    length: generateLength(),
    genres: generateGenres(),
    director: generateName(),
    writers: generateNames(),
    cast: generateNames(),
    country: generateCountry(),
    ageRestriction: generateAgeRestriction(),
    comments: generateComments(),
    isOnWatchlist: generateRandomBoolean(),
    isWatched: generateRandomBoolean(),
    isFavourite: generateRandomBoolean(),
  }
);
