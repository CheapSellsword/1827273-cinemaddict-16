const compareByField = (field) => {
  if (Array.isArray(field)) {
    return (a,b) => a[field].length < b[field].length ? 1 : -1;
  }
  return (a,b) => a[field] < b[field] ? 1 : -1;
};

export const createTopRatedFilmList = (films) => {
  const topRatedFilmList = films.slice().sort(compareByField('rating'));
  if (Math.max(topRatedFilmList[0].rating, topRatedFilmList[1].rating) === 0) {
    return null;
  }
  return topRatedFilmList;
};

export const createMostCommentedFilmList = (films) => {
  const mostCommentedFilmList = films.slice().sort(compareByField('comments'));
  if (Math.max(mostCommentedFilmList[0].comments.length, mostCommentedFilmList[1].comments.length) === 0) {
    return null;
  }
  return mostCommentedFilmList;
};
