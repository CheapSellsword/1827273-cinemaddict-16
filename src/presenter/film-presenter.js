import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import { render, RenderPosition, appendChild, remove, replace } from '../utils/render';

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;

  #body = document.querySelector('body');


  constructor(filmContainer, changeData) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
  }

  init = (film, closePopup) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film);

    this.#filmComponent.setFilmCardClickHandler(() => {
      closePopup(prevPopupComponent);
      appendChild(this.#body, this.#filmPopupComponent);
      this.#body.classList.add('hide-overflow');
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
      this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
      this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
      this.#filmPopupComponent.setCloseButtonClickHandler(this.#closePopupClickHandler);
    });

    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmContainer, this.#filmComponent, RenderPosition.BEFORE_END);
    }

    if (this.#filmContainer.contains(prevFilmComponent)) {
      // Пытаюсь сделать проверку на подобие проверки в лайве: this.#filmContainer.contains(prevFilmComponent), но выдаётся ошибка "Cannot read properties of null"?
      replace(this.#filmComponent, prevFilmComponent);
    }

    if (this.#body.contains(prevPopupComponent)) {
      replace(this.#filmPopupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
    // В какой момент эти функции будут задействованы?
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#body.classList.remove('hide-overflow');
      remove(this.#filmPopupComponent);
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #closePopupClickHandler = () => {
    this.#body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleWatchlistClick = () => {
    this.#changeData({...this.#film, isOnWatchlist: !this.#film.isOnWatchlist});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }// Не понятен синтаксис этой функции
}
