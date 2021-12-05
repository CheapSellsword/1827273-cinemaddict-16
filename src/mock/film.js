import { MIN_ITEMS_COUNT, MIN_NUMBER, MAX_NUMBER, TITLES, POSTERS, DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT, MAX_FILM_HOURS, MAX_FILM_MINUTES, GENRES, MAX_GENRES_COUNT, COUNTRIES, AGE_RESTRICTIONS, EMOJIS, NAMES, SURNAMES, MAX_NAMES_COUNT, PIECES_OF_COMMENTS, MAX_PIECES_OF_COMMENTS, MAX_COMMENTS } from '../consts';
import { getRandomInteger, getFormattedTimeOfComment, generateFullReleaseDate, generateYearOnly } from '../util';
//как лучше импортировать?
import { getRandomItemFromArray } from '../util';
import { getRandomPositiveFloat } from '../util';
import { generateRandomBoolean } from '../util';
import { generateDataArray } from '../util';

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

const generateEmoji = () => getRandomItemFromArray(EMOJIS);
const generateGenre = () => getRandomItemFromArray(GENRES);
const generateGenres = () => generateDataArray(getRandomInteger(MIN_ITEMS_COUNT, MAX_GENRES_COUNT), generateGenre);
const generateLength = () => `${getRandomInteger(MIN_NUMBER, MAX_FILM_HOURS)  }h ${  getRandomInteger(MIN_NUMBER, MAX_FILM_MINUTES)  }m`;
const generateRating = () => getRandomPositiveFloat(MIN_NUMBER, MAX_NUMBER);
const generateCountry = () => getRandomItemFromArray(COUNTRIES);
const generateAgeRestriction = () => getRandomItemFromArray(AGE_RESTRICTIONS);

const generateName = () => {
  const fullName = `${getRandomItemFromArray(NAMES)} ${getRandomItemFromArray(SURNAMES)}`;
  return fullName;
};

const generateNames = () => generateDataArray(getRandomInteger(MIN_ITEMS_COUNT, MAX_NAMES_COUNT), generateName);

const generateCommentText = () => {
  const randomCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_PIECES_OF_COMMENTS);
  let fullComment = '';
  for (let i = MIN_ITEMS_COUNT; i <= randomCount; i++) {
    const randomPieceOfCommentIndex = getRandomInteger(MIN_NUMBER, PIECES_OF_COMMENTS.length - 1);
    fullComment += PIECES_OF_COMMENTS[randomPieceOfCommentIndex];
  }
  return fullComment;
};

const generateComment = (id) => (
  {
    id,
    emoji: generateEmoji(),
    author: generateName(),
    text: generateCommentText(),
    date: getFormattedTimeOfComment(),
  }
);

const generateComments = () => generateDataArray(getRandomInteger(MIN_NUMBER, MAX_COMMENTS), generateComment);

// Получается создать массив из id комментариев, но не понимаю как связать их с объектами комментариев с помощью ссылок
/* const generateComments = () => {
  const randomCommentsCount = getRandomInteger(MIN_ITEMS_COUNT, MAX_COMMENTS);
  const filmComments = [];
  for (let i = MIN_NUMBER; i < randomCommentsCount; i++) {
    const newComment = generateComment(i+1);
    filmComments.push(newComment);
  }
  return filmComments.map((comment) => comment.id);
}; */

export const generateFilm = () => (
  {
    title: generateTitle(),
    alternativeTitle: generateTitle(),
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
