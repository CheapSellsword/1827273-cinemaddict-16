import { Mode } from '../consts';
import { render, RenderPosition, appendChild, remove, replace } from '../utils/render';
import FilmPopupView from '../view/film-popup-view';
import FilmCardView from '../view/film-card-view';

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #mode = Mode.DEFAULT;

  #body = document.querySelector('body');

  #id = null;

  constructor(filmContainer, changeData, changeMode) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);
    this.#filmPopupComponent = new FilmPopupView(film, this.#addPopupListeners);

    this.#filmComponent.setFilmCardClickHandler(this.#filmCardClickHandler);
    this.#filmComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmContainer, this.#filmComponent, RenderPosition.BEFORE_END);
    }

    if (this.#mode === Mode.DEFAULT && prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if (this.#mode !== Mode.DEFAULT && prevFilmComponent !== null) {
      replace(this.#filmComponent, prevFilmComponent);
      remove(prevFilmComponent);
    }

    if (this.#mode !== Mode.DEFAULT && prevPopupComponent !== null) {
      replace(this.#filmPopupComponent, prevPopupComponent);
      this.#addPopupListeners();
      remove(prevPopupComponent);
      this.#filmComponent.removeFilmCardClickHandler(this.#filmCardClickHandler);
    }
  }

  get id() {
    this.#id = this.#film.id;
    return this.#id;
  }

  closePopup = () => {
    if (this.#mode !== Mode.DEFAULT) {
      remove(this.#filmPopupComponent);
      this.#mode = Mode.DEFAULT;
      this.#filmComponent.removeFilmCardClickHandler(this.#filmCardClickHandler);
      this.#filmComponent.setFilmCardClickHandler(this.#filmCardClickHandler);
    }
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
      this.#mode = Mode.DEFAULT;
      this.#filmComponent.setFilmCardClickHandler(this.#filmCardClickHandler);
    }
  };

  #closePopupClickHandler = () => {
    this.#body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#filmComponent.setFilmCardClickHandler(this.#filmCardClickHandler);
  };

  #filmCardClickHandler = () => {
    appendChild(this.#body, this.#filmPopupComponent);
    this.#body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#addPopupListeners();
    this.#changeMode();
    this.#mode = Mode.POPUP;
    this.#filmPopupComponent.reset(this.#film);
    this.#filmComponent.removeFilmCardClickHandler(this.#filmCardClickHandler);
  }

  #addPopupListeners = () => {
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#filmPopupComponent.setFormSubmitHandler(this.#handleNewCommentSubmit);
  }

  #handleWatchlistClick = () => {
    this.#changeData({...this.#film, isOnWatchlist: !this.#film.isOnWatchlist});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }

  #handleNewCommentSubmit = (film) => {
    this.#changeData(film);
  }
}
