import AbstractView from './abstract-view';

const createFilmPopupTemplate = (film) => {
  const {
    title,
    poster,
    fullReleaseDate,
    rating,
    length,
    genres,
    director,
    writers,
    cast,
    country,
    description,
    ageRestriction,
    isOnWatchlist,
    isWatched,
    isFavorite,
    comments,
  } = film;
  const genreSuffix = genres.length > 1 ? 'Genres' : 'Genre';

  const createGenresTemplate = () => genres.map((genre) =>
    `<span class="film-details__genre">${genre || ''}</span>`
  ).join('');

  const watchlistClassName = isOnWatchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = isWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--active'
    : '';

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRestriction}</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${title}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${cast}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${fullReleaseDate}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${length}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${genreSuffix}</td>
                        <td class="film-details__cell">
                          ${createGenresTemplate()}</td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button ${watchlistClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button ${favoriteClassName} film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
                    <h2 class="films-list__title">Comments could not be displayed due to an error :( </h2>
                </section>
              </div>
            </form>
          </section>`;
};

export default class NoCommentsView extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmPopupTemplate(this.#film);
  }

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeButtonClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  }

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
