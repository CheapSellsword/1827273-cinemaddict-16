import { MAX_DESCRIPTION_LENGTH } from '../consts';

export const createFilmCard = (film) => {
  const {title, poster, releaseYear, rating, length, genres, comments, isOnWatchlist, isWatched, isFavorite} = film;
  let {description} = film;
  description = description.length > MAX_DESCRIPTION_LENGTH ?
    `${description.substring(0, MAX_DESCRIPTION_LENGTH - 1)  }...` : description;

  const watchlistClassName = isOnWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = isWatched
    ? 'film-card__controls-item--active'
    : '';

  const favouriteClassName = isFavorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
            <a class="film-card__link">
              <h3 class="film-card__title">${title}</h3>
              <p class="film-card__rating">${rating}</p>
              <p class="film-card__info">
                <span class="film-card__year">${releaseYear}</span>
                <span class="film-card__duration">${length}</span>
                <span class="film-card__genre">${genres}</span>
              </p>
              <img src="${poster}" alt="" class="film-card__poster">
              <p class="film-card__description">${description}</p>
              <span class="film-card__comments">${comments.length} comments</span>
            </a>
            <div class="film-card__controls">
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${favouriteClassName}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

