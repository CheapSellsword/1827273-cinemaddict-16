import { FILMS_COUNT_PER_STEP} from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import SortView from '../view/sort-view';
import FilmSectionView from '../view/film-section-view';
import ShowMoreButtonView from '../view/show-more-button-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import { updateItem } from '../utils/common';

export default class CollectionPresenter {
  #collectionContainer = null;

  #sortComponent = new SortView();
  #filmSectionComponent = new FilmSectionView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #noFilmComponent = new NoFilmView();

  #collectionFilms = [];
  #filmPresenter = new Map();

  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.filmContainer;

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    this.#renderCollection(this.#collectionFilms);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#collectionFilms = updateItem(this.#collectionFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (filmContainer, film) => {
    const filmPresenter = new FilmPresenter(filmContainer, this.#handleFilmChange, this.#handleModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (films, from, to, filmContainer) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(filmContainer, film));
  }

  #renderFilmList = () => {
    this.#renderFilms(this.#collectionFilms, 0, Math.min(this.#collectionFilms.length, this.#renderedFilmCardsCount), this.#filmContainer);
    if (this.#collectionFilms.length > FILMS_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderSort = () => {
    render(this.#collectionContainer, this.#sortComponent, RenderPosition.BEFORE_END);
  }

  #renderFilmSection = () => {
    render(this.#collectionContainer, this.#filmSectionComponent, RenderPosition.BEFORE_END);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderFilms(this.#collectionFilms, this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_COUNT_PER_STEP, this.#filmContainer);
    this.#renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if (this.#renderedFilmCardsCount >= this.#collectionFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderNoFilm = () => {
    render(this.#collectionContainer, this.#noFilmComponent);
  }

  #clearFilmSection = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #clearFilmCollection = () => {
    remove(this.#sortComponent);
    remove(this.#filmSectionComponent);
    remove(this.#showMoreButtonComponent);
    this.#renderedFilmCardsCount = 0;
  }

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.closePopup());
  }

  #renderCollection = (collectionFilms) => {
    if (collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
    } else {
      this.#renderNoFilm();
    }
  }
}
