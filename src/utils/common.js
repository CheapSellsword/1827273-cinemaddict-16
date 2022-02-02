const compareByFieldLength = (field) => (a,b) => b[field].length - a[field].length;

export const compareByField = (field) => (a,b) => b[field] - a[field];

export const isEmptyString = (str) => !str || str.trim().length === 0;

export const createTopRatedFilmList = (films) => {
  const topRatedFilmList = films.filter((film) => film.rating > 0).sort(compareByField('rating'));
  if (Math.max(topRatedFilmList[0].rating, topRatedFilmList[1].rating) === 0) {
    return [];
  }
  return topRatedFilmList;
};

export const createMostCommentedFilmList = (films) => {
  const mostCommentedFilmList = films.slice().sort(compareByFieldLength('comments'));
  const mostCommentedFilms = mostCommentedFilmList.filter((film) => film.comments.length > 0);
  if (Math.max(mostCommentedFilmList[0].comments.length, mostCommentedFilmList[1].comments.length) === 0) {
    return [];
  }
  return mostCommentedFilms;
};
