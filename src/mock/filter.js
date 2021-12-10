import { MIN_NUMBER } from '../consts';

const filmToFilterMap = {
  allMovies: (films) => films.length,
  watchlist: (films) => films.filter((film) => !film.isOnWatchlist).length,
  history: (films) => films.filter((film) => !film.isWatched).length,
  favorites: (films) => films.filter((film) => !film.isFavorite).length,
};

const filterNamesToMap = {
  allFilter: 'All movies',
  watchlistFilter: 'Watchlist',
  historyFilter: 'History',
  favoritesFilter: 'Favorites',
};

export const generateFilter = (films) => {
  const hrefAndCount = Object.entries(filmToFilterMap).map(
    ([filterHref, filmsCount]) => ({
      href: filterHref,
      count: filmsCount(films),
    }),
  );

  const filterNames = Object.entries(filterNamesToMap).map(
    ([, filterTitle]) => ({
      name: filterTitle,
    })
  );
  for (let i = MIN_NUMBER; i < hrefAndCount.length; i++) {
    Object.assign (hrefAndCount[i], filterNames[i]);
  }
  return hrefAndCount;
};
