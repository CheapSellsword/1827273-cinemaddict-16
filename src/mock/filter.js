const filmToFilterMap = {
  allMovies: (films) => films.length,
  watchlist: (films) => films.filter((film) => !film.isOnWatchlist).length,
  history: (films) => films.filter((film) => !film.isWatched).length,
  favourites: (films) => films.filter((film) => !film.isFavourite).length,
};

export const generateFilter = (films) => Object.entries(filmToFilterMap).map(
  ([filterName, filmsCount]) => ({
    name: filterName,
    count: filmsCount(films),
  }),
);
