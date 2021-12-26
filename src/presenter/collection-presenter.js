import { FILMS_COUNT_PER_STEP } from '../consts';
import { render, RenderPosition, remove } from '../utils/render';
import { createTopRatedFilmList, createMostCommentedFilmList } from '../mock/extra-films';
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

  #body = document.querySelector('body');
  #renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  #filmContainer = this.#filmSectionComponent.filmContainer;
  #topRatedSection = this.#filmSectionComponent.topRatedSection;
  #topRatedFilmContainer = this.#filmSectionComponent.topRatedFilmContainer;
  #mostCommentedSection = this.#filmSectionComponent.mostCommentedSection;
  #mostCommentedFilmContainer = this.#filmSectionComponent.mostCommentedFilmContainer;
  // Как обойтись без поиска секций для отрисовки в них фильмов?

  constructor(collectionContainer) {
    this.#collectionContainer = collectionContainer;
  }

  init = (collectionFilms) => {
    this.#collectionFilms = [...collectionFilms];
    this.#renderCollection(collectionFilms);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#collectionFilms = updateItem(this.#collectionFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderFilm = (filmContainer, film) => {
    const filmPresenter = new FilmPresenter(filmContainer, this.#handleFilmChange);
    filmPresenter.init(film, this.#closePrevPopup);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #closePrevPopup = (prevPopup) => {
    // Не понятна схема с закрытием попапа:
    // Как должна выглядеть эта функция?
    // Почему она должна создаваться в главном презентере, где нет FilmPopupView, и передаваться в меньший презентер?
    // Пункт задания "В презентере списка фильмов реализуйте метод для этого колбэка, который скроет попап, если таковой уже открыт." - как это реализовать и для какой ситуации?
    if(this.#body.contains(prevPopup)) {
      remove(prevPopup);
    }
  }

  #renderFilms = (from, to) => {
    this.#collectionFilms
      .slice(from, to)
      .forEach((film) => this.#renderFilm(this.#filmContainer, film));
  }

  #renderFilmList = () => {
    this.#renderFilms(0, Math.min(this.#collectionFilms.length, this.#renderedFilmCardsCount));
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
    this.#renderFilms(this.#renderedFilmCardsCount, this.#renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    this.#renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if (this.#renderedFilmCardsCount >= this.#collectionFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#filmContainer, this.#showMoreButtonComponent, RenderPosition.AFTER_END);
    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  #renderTopRatedFilms = (collectionFilms) => {
    if (createTopRatedFilmList(collectionFilms)) {
      createTopRatedFilmList(collectionFilms).forEach((film) => this.#renderFilm(this.#topRatedFilmContainer, film));
    } else {
      this.#topRatedSection.remove();
    }
  }

  #renderMostCommentedFilms = (collectionFilms) => {
    if (createMostCommentedFilmList(collectionFilms)) {
      createMostCommentedFilmList(collectionFilms).forEach((film) => this.#renderFilm(this.#mostCommentedFilmContainer, film));
    } else {
      this.#mostCommentedSection.remove();
    }
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

  #renderCollection = (collectionFilms) => {
    if (collectionFilms.length) {
      this.#renderSort();
      this.#renderFilmSection();
      this.#renderFilmList();
      this.#renderTopRatedFilms(collectionFilms);
      this.#renderMostCommentedFilms(collectionFilms);
    } else {
      this.#renderNoFilm();
    }
  }
}