import { MIN_ITEMS_COUNT, MIN_NUMBER, MAX_NUMBER, TITLES, POSTERS, DESCRIPTIONS, MAX_DESCRIPTIONS_COUNT, GENRES, MAX_GENRES_COUNT, COUNTRIES, AGE_RESTRICTIONS, EMOJIS, NAMES, SURNAMES, MAX_NAMES_COUNT, PIECES_OF_COMMENTS, MAX_PIECES_OF_COMMENTS, MAX_COMMENTS } from '../consts';
import { generateDataArray, generateRandomBoolean, getRandomPositiveFloat, getRandomItemFromArray, getRandomInteger } from '../utils/common';
import { generateFullReleaseDate, getHumanizedTimeOfComments, generateYearOnly, generateFilmLength } from '../utils/dates-and-time';
import { nanoid } from 'nanoid';

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

const generateComment = () => (
  {
    id: nanoid(),
    emoji: generateEmoji(),
    author: generateName(),
    text: generateCommentText(),
    date: getHumanizedTimeOfComments(),
  }
);

const generateComments = () => generateDataArray(getRandomInteger(MIN_NUMBER, MAX_COMMENTS), generateComment);

export const generateFilm = () => (
  {
    id: nanoid(),
    title: generateTitle(),
    alternativeTitle: generateTitle(),
    poster: generatePoster(),
    description: generateDescription(),
    fullReleaseDate: generateFullReleaseDate(),
    releaseYear: generateYearOnly(),
    rating: generateRating(),
    length: generateFilmLength(),
    genres: generateGenres(),
    director: generateName(),
    writers: generateNames(),
    cast: generateNames(),
    country: generateCountry(),
    ageRestriction: generateAgeRestriction(),
    comments: generateComments(),
    isOnWatchlist: generateRandomBoolean(),
    isWatched: generateRandomBoolean(),
    isFavorite: generateRandomBoolean(),
  }
);
