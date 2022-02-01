import { render, RenderPosition, appendChild, remove, replace } from '../utils/render';
import { Mode, UserAction, UpdateType, EvtKey, State } from '../consts';
import FilmPopupView from '../view/film-popup-view';
import FilmCardView from '../view/film-card-view';
import NoCommentsView from '../view/no-comments-view';

export default class FilmPresenter {
  #filmContainer = null;
  #changeData = null;
  #changeMode = null;
  #filmComponent = null;
  #filmPopupComponent = null;
  #film = null;
  #commentsModel = null;
  #id = null;

  #mode = Mode.DEFAULT;
  #body = document.querySelector('body');

  constructor(filmContainer, changeData, changeMode, commentsModel) {
    this.#filmContainer = filmContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#commentsModel = commentsModel;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmCardView(film);

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
    }
  }

  get id() {
    return this.#film.id;
  }

  get popupScrollPosition() {
    if (this.#mode === Mode.DEFAULT) {
      return null;
    }
    return this.#filmPopupComponent.scrollPosition;
  }

  openPopup = async (scrollPosition) => {
    try {
      await this.#commentsModel.init(this.#film.id, this.#handleModelEvent);
      this.#filmPopupComponent.scrollPosition = scrollPosition;
    } catch (err){
      this.setViewState(State.ABORTING);
    }
  }

  closePopup = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#filmPopupComponent.reset(this.#film);
      remove(this.#filmPopupComponent);
      this.removeDocumentEventListeners();
      this.#mode = Mode.DEFAULT;
    }
  }

  setViewState = (state) => {
    if (this.#mode !== Mode.POPUP) {
      return;
    }
    const resetFormState = () => {
      this.#filmPopupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
        });
        break;
      case State.DELETING:
        this.#filmPopupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this.#filmPopupComponent.shake(resetFormState);
        break;
    }
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  removeDocumentEventListeners = () => {
    if (this.#mode !== Mode.POPUP) {
      return;
    }
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#filmPopupComponent.removeFormSubmitHandler();
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === EvtKey.ESCAPE || evt.key === EvtKey.ESC) {
      evt.preventDefault();
      this.#body.classList.remove('hide-overflow');
      remove(this.#filmPopupComponent);
      this.#mode = Mode.DEFAULT;
      this.#filmPopupComponent.reset(this.#film);
      this.removeDocumentEventListeners();
    }
  };

  #closePopupClickHandler = () => {
    this.#body.classList.remove('hide-overflow');
    remove(this.#filmPopupComponent);
    this.#mode = Mode.DEFAULT;
    this.#filmPopupComponent.reset(this.#film);
    this.removeDocumentEventListeners();
  };

  #filmCardClickHandler = () => {
    this.openPopup();
  }

  #addPopupListeners = () => {
    this.#filmPopupComponent.setWatchlistClickHandler(this.#handleWatchlistClick);
    this.#filmPopupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#filmPopupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#filmPopupComponent.setClosePopupClickHandler(this.#closePopupClickHandler);
    this.#filmPopupComponent.setCommentDeleteClickHandler(this.#handleCommentDeleteClick);
    this.#filmPopupComponent.setFormSubmitHandler(this.#handleNewCommentSubmit);
  }

  #handleWatchlistClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#mode,
      {...this.#film, isOnWatchlist: !this.#film.isOnWatchlist},
    );
  }

  #handleWatchedClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#mode,
      {...this.#film, isWatched: !this.#film.isWatched},
    );
  }

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      this.#mode,
      {...this.#film, isFavorite: !this.#film.isFavorite},
    );
  }

  #handleNewCommentSubmit = (newComment) => {
    this.#changeData(
      UserAction.ADD_COMMENT,
      UpdateType.MINOR,
      this.#mode,
      newComment,
      this.#film,
    );
  }

  #handleCommentDeleteClick = (update) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      this.#mode,
      update,
      this.#film,
    );
  }

  #handleModelEvent = (isError, comments) => {
    if (isError) {
      this.#filmPopupComponent = new NoCommentsView(this.#film);
    } else {
      this.#filmPopupComponent = new FilmPopupView(this.#film, comments, this.#addPopupListeners);
    }
    appendChild(this.#body, this.#filmPopupComponent);
    this.#body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#addPopupListeners();
    this.#changeMode();
    this.#mode = Mode.POPUP;
    this.#filmPopupComponent.reset(this.#film);
  }
}
