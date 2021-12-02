import { getRandomInteger } from '../util';
import { getFormattedTimeOfComment } from '../util';
import { generateFullReleaseDate } from '../util';
import { generateYearOnly } from '../util';

// Информация о фильме
const titles = [
  'The Dance of Life',
  'Sagebrush Trail',
  'The Man with the Golden Arm',
  'Santa Claus Conquers the Martians',
  'Popeye the Sailor Meets Sindbad the Sailor',
  'The Great Flamarion',
  'Made for Each Other',
];

const generateTitle = () => titles[getRandomInteger(0, titles.length - 1)];

const posters = [
  './images/posters/the-dance-of-life.jpg',
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];

const generatePoster = () => posters[getRandomInteger(0, posters.length - 1)];

const generateDescription = () => {
  const descriptions = [
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

  const maxDescriptionsCount = 5;
  const randomCount = getRandomInteger(1, maxDescriptionsCount);
  let fullDescription = '';
  for (let i = 1; i <= randomCount; i++) {
    const randomDescriptionIndex = getRandomInteger(0, descriptions.length - 1);
    fullDescription += descriptions[randomDescriptionIndex];
  }
  return fullDescription;
};

const generateRating = () => {
  const randomRating = `${getRandomInteger(0, 9)  }.${  getRandomInteger(0, 9)}`;
  return randomRating;
};

const generateLength = () => {
  const maxFilmLengthInHours = 2;
  const maxMinutes = 59;
  const randomLength = `${getRandomInteger(0, maxFilmLengthInHours)  }h ${  getRandomInteger(0, maxMinutes)  }m`;
  return randomLength;
};

const genres = [
  ' Musical',
  ' Western',
  ' Drama',
  ' Comedy',
  ' Cartoon',
  ' Mystery',
  ' Film-Noir',
];

const generateGenre = () => genres[getRandomInteger(0, genres.length - 1)];

const generateGenres = () => {
  const maxGenresCount = 3;
  const randomGenresCount = getRandomInteger(1, maxGenresCount);
  const genresArray = [];
  for (let i = 0; i < randomGenresCount; i++) {
    const newGenre = generateGenre();
    genresArray.push(newGenre);
  }
  return genresArray;
};

const countries = ['US', 'Germany', 'France', 'Russia', 'England', 'Italy'];
const generateCountry = () => countries[getRandomInteger(0, countries.length - 1)];

const ageRestrictions = ['0+', '12+', '16+', '18+'];
const generateAgeRestriction = () => ageRestrictions[getRandomInteger(0, ageRestrictions.length - 1)];


// Комментарии и имена
const emojis = [
  './images/emoji/smile.png',
  './images/emoji/sleeping.png',
  './images/emoji/angry.png',
  './images/emoji/puke.png',
];

const generateEmoji = () => emojis[getRandomInteger(0, emojis.length - 1)];

const names = [
  'Иван',
  'Хуан Себастьян',
  'Мария',
  'Кристоф',
  'Виктор',
  'Юлия',
  'Люпита',
  'Вашингтон',
];

const surnames = [
  'да Марья',
  'Верон',
  'Мирабелла',
  'Вальц',
  'Онопко',
  'Топольницкая',
  'Нионго',
  'Ирвинг',
];

const generateName = () => {
  const fullName = `${names[getRandomInteger(0, names.length - 1)]  } ${  surnames[getRandomInteger(0, surnames.length - 1)]}`;
  return fullName;
};

const generateNames = () => {
  const maxNamesCount = 4;
  const randomNamesCount = getRandomInteger(1, maxNamesCount);
  const fullNames = [];
  for (let i = 0; i < randomNamesCount; i++) {
    const newName = generateName();
    fullNames.push(newName);
  }
  return fullNames;
};

const generateCommentText = () => {
  const piecesOfComments = [
    'Interesting setting! ',
    'A good cast! ',
    'Booooooooooring. ',
    'Very very old. ',
    'Meh ',
    'Almost two hours? ',
    'Seriously? ',
  ];

  const maxPiecesOfComments = 3;
  const randomCount = getRandomInteger(1, maxPiecesOfComments);
  let fullComment = '';
  for (let i = 1; i <= randomCount; i++) {
    const randomPieceOfCommentIndex = getRandomInteger(0, piecesOfComments.length - 1);
    fullComment += piecesOfComments[randomPieceOfCommentIndex];
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

const generateComments = () => {
  const maxComments = 5;
  const randomCommentsCount = getRandomInteger(1, maxComments);
  const filmComments = [];
  for (let i = 0; i < randomCommentsCount; i++) {
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
